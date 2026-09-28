from __future__ import annotations

import argparse
import hashlib
import json
import math
import struct
from pathlib import Path
from typing import Any

import numpy as np
import open3d as o3d

EXPECTED_SOURCE_SHA256 = "ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c"
OPEN3D_VERSION = "0.20.0"

COMPONENT_DTYPES = {
    5120: np.int8,
    5121: np.uint8,
    5122: np.int16,
    5123: np.uint16,
    5125: np.uint32,
    5126: np.float32,
}

TYPE_COMPONENTS = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT2": 4,
    "MAT3": 9,
    "MAT4": 16,
}


def fail(message: str) -> None:
    raise RuntimeError(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_glb(path: Path) -> tuple[dict[str, Any], bytes]:
    raw = path.read_bytes()

    if len(raw) < 20 or raw[:4] != b"glTF":
        fail("Input is not a valid glTF GLB.")

    version, declared_length = struct.unpack_from("<II", raw, 4)
    if version != 2:
        fail(f"Expected glTF 2, received version {version}.")
    if declared_length != len(raw):
        fail("GLB declared length does not match actual file length.")

    offset = 12
    document = None
    binary = None

    while offset + 8 <= len(raw):
        byte_length, chunk_type = struct.unpack_from("<II", raw, offset)
        start = offset + 8
        end = start + byte_length

        if end > len(raw):
            fail("GLB chunk exceeds file boundary.")

        if chunk_type == 0x4E4F534A:
            document = json.loads(raw[start:end].rstrip(b"\x00 \t\r\n").decode("utf-8"))
        elif chunk_type == 0x004E4942:
            binary = raw[start:end]

        offset = end

    if document is None or binary is None:
        fail("GLB is missing JSON or BIN chunk.")

    return document, binary


def accessor_array(document: dict[str, Any], binary: bytes, accessor_index: int) -> np.ndarray:
    accessor = document["accessors"][accessor_index]
    view = document["bufferViews"][accessor["bufferView"]]

    component_type = accessor["componentType"]
    dtype = COMPONENT_DTYPES.get(component_type)
    if dtype is None:
        fail(f"Unsupported glTF component type: {component_type}")

    component_count = TYPE_COMPONENTS[accessor["type"]]
    count = accessor["count"]

    component_size = np.dtype(dtype).itemsize
    item_size = component_size * component_count
    stride = view.get("byteStride", item_size)

    view_offset = view.get("byteOffset", 0)
    accessor_offset = accessor.get("byteOffset", 0)
    start = view_offset + accessor_offset

    if stride == item_size:
        array = np.frombuffer(
            binary,
            dtype=dtype,
            count=count * component_count,
            offset=start,
        ).reshape(count, component_count)
        return array.astype(np.float64, copy=False)

    output = np.empty((count, component_count), dtype=np.float64)
    for index in range(count):
        row_start = start + index * stride
        row = np.frombuffer(
            binary,
            dtype=dtype,
            count=component_count,
            offset=row_start,
        )
        output[index] = row

    return output


def quaternion_matrix(quaternion: list[float]) -> np.ndarray:
    x, y, z, w = quaternion
    norm = math.sqrt(x * x + y * y + z * z + w * w)
    if norm == 0:
        return np.eye(4)

    x /= norm
    y /= norm
    z /= norm
    w /= norm

    return np.array(
        [
            [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
            [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
            [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0],
            [0, 0, 0, 1],
        ],
        dtype=np.float64,
    )


def node_matrix(node: dict[str, Any]) -> np.ndarray:
    if "matrix" in node:
        return np.asarray(node["matrix"], dtype=np.float64).reshape((4, 4), order="F")

    translation = np.eye(4)
    translation[:3, 3] = np.asarray(node.get("translation", [0, 0, 0]), dtype=np.float64)

    rotation = quaternion_matrix(node.get("rotation", [0, 0, 0, 1]))

    scale = np.eye(4)
    scale_values = np.asarray(node.get("scale", [1, 1, 1]), dtype=np.float64)
    scale[0, 0], scale[1, 1], scale[2, 2] = scale_values

    return translation @ rotation @ scale


def transform_points(points: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    homogeneous = np.concatenate([points[:, :3], np.ones((len(points), 1))], axis=1)
    return (homogeneous @ matrix.T)[:, :3]


def transform_normals(normals: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    normal_matrix = np.linalg.inv(matrix[:3, :3]).T
    transformed = normals[:, :3] @ normal_matrix.T
    lengths = np.linalg.norm(transformed, axis=1, keepdims=True)
    lengths[lengths == 0] = 1
    return transformed / lengths


def extract_points_and_normals(document: dict[str, Any], binary: bytes) -> tuple[np.ndarray, np.ndarray]:
    nodes = document.get("nodes", [])
    meshes = document.get("meshes", [])
    scene_index = document.get("scene", 0)
    scenes = document.get("scenes", [])

    if not scenes:
        fail("GLB has no scenes.")

    root_nodes = scenes[scene_index].get("nodes", [])
    point_batches: list[np.ndarray] = []
    normal_batches: list[np.ndarray] = []

    def visit(node_index: int, parent_matrix: np.ndarray) -> None:
        node = nodes[node_index]
        world = parent_matrix @ node_matrix(node)

        mesh_index = node.get("mesh")
        if mesh_index is not None:
            mesh = meshes[mesh_index]
            for primitive in mesh.get("primitives", []):
                if primitive.get("mode", 4) != 0:
                    continue

                attributes = primitive.get("attributes", {})
                position_index = attributes.get("POSITION")
                normal_index = attributes.get("NORMAL")

                if position_index is None or normal_index is None:
                    fail("Point primitive is missing POSITION or NORMAL.")

                points = accessor_array(document, binary, position_index)
                normals = accessor_array(document, binary, normal_index)

                if len(points) != len(normals):
                    fail("Point and normal accessor counts differ.")

                point_batches.append(transform_points(points, world))
                normal_batches.append(transform_normals(normals, world))

        for child_index in node.get("children", []):
            visit(child_index, world)

    identity = np.eye(4)
    for root_node in root_nodes:
        visit(root_node, identity)

    if not point_batches:
        fail("No POINTS primitives with normals were found.")

    points = np.concatenate(point_batches, axis=0)
    normals = np.concatenate(normal_batches, axis=0)

    return points, normals


def bounds(array: np.ndarray) -> dict[str, list[float]]:
    minimum = array.min(axis=0)
    maximum = array.max(axis=0)
    size = maximum - minimum

    return {
        "min": minimum.tolist(),
        "max": maximum.tolist(),
        "size": size.tolist(),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_glb")
    parser.add_argument("output_ply")
    parser.add_argument("report_json")
    parser.add_argument("--depth", type=int, default=9)
    parser.add_argument("--density-quantile", type=float, default=0.02)
    parser.add_argument("--target-triangles", type=int, default=220_000)
    args = parser.parse_args()

    source_path = Path(args.source_glb)
    output_path = Path(args.output_ply)
    report_path = Path(args.report_json)

    source_hash = sha256(source_path)
    if source_hash != EXPECTED_SOURCE_SHA256:
        fail(
            "Source GLB checksum changed. "
            f"Expected {EXPECTED_SOURCE_SHA256}, received {source_hash}."
        )

    document, binary = read_glb(source_path)
    points, normals = extract_points_and_normals(document, binary)

    if len(points) != 99_992:
        fail(f"Expected 99,992 points, received {len(points):,}.")

    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(points)
    pcd.normals = o3d.utility.Vector3dVector(normals)
    pcd.normalize_normals()

    # The source already contains normals. This deterministic consistency pass
    # only resolves sign continuity for Poisson; it does not invent geometry.
    pcd.orient_normals_consistent_tangent_plane(30)

    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd,
        depth=args.depth,
        scale=1.08,
        linear_fit=False,
        n_threads=-1,
    )

    source_box = pcd.get_axis_aligned_bounding_box()
    extent = source_box.get_extent()
    padding = max(float(np.max(extent)) * 0.015, 1e-6)
    crop_box = o3d.geometry.AxisAlignedBoundingBox(
        source_box.min_bound - padding,
        source_box.max_bound + padding,
    )
    mesh = mesh.crop(crop_box)

    density_values = np.asarray(densities)
    if len(density_values) == len(np.asarray(mesh.vertices)):
        threshold = float(np.quantile(density_values, args.density_quantile))
        mesh.remove_vertices_by_mask(density_values < threshold)
    else:
        threshold = None

    triangle_count_before_components = len(mesh.triangles)

    if triangle_count_before_components > 0:
        clusters, cluster_triangles, _ = mesh.cluster_connected_triangles()
        clusters = np.asarray(clusters)
        cluster_triangles = np.asarray(cluster_triangles)

        if len(cluster_triangles) > 0:
            largest = int(cluster_triangles.max())
            minimum_cluster = max(80, int(largest * 0.005))
            remove_triangles = cluster_triangles[clusters] < minimum_cluster
            mesh.remove_triangles_by_mask(remove_triangles)
            mesh.remove_unreferenced_vertices()

    if len(mesh.triangles) > args.target_triangles:
        mesh = mesh.simplify_quadric_decimation(args.target_triangles)

    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_duplicated_vertices()
    mesh.remove_non_manifold_edges()
    mesh.compute_vertex_normals()

    if len(mesh.vertices) == 0 or len(mesh.triangles) == 0:
        fail("Surface reconstruction produced an empty mesh.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.parent.mkdir(parents=True, exist_ok=True)

    if not o3d.io.write_triangle_mesh(
        str(output_path),
        mesh,
        write_ascii=False,
        compressed=False,
        write_vertex_normals=True,
        write_vertex_colors=False,
        write_triangle_uvs=False,
    ):
        fail("Open3D failed to write reconstructed PLY.")

    vertices = np.asarray(mesh.vertices)

    report = {
        "schemaVersion": 1,
        "source": {
            "path": str(source_path),
            "bytes": source_path.stat().st_size,
            "sha256": source_hash,
            "pointCount": len(points),
            "bounds": bounds(points),
        },
        "tool": {
            "name": "Open3D",
            "version": OPEN3D_VERSION,
            "algorithm": "Poisson surface reconstruction",
            "parameters": {
                "depth": args.depth,
                "scale": 1.08,
                "linearFit": False,
                "normalConsistencyK": 30,
                "densityQuantile": args.density_quantile,
                "connectedComponentMinRatio": 0.005,
                "targetTriangles": args.target_triangles,
            },
        },
        "output": {
            "path": str(output_path),
            "bytes": output_path.stat().st_size,
            "sha256": sha256(output_path),
            "vertexCount": len(mesh.vertices),
            "triangleCount": len(mesh.triangles),
            "bounds": bounds(vertices),
            "densityThreshold": threshold,
        },
    }

    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
