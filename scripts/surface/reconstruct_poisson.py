#!/usr/bin/env python3

import argparse
import hashlib
import json
import platform
from pathlib import Path

import numpy as np
import open3d as o3d


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def vector(values):
    return [float(value) for value in values]


def main():
    parser = argparse.ArgumentParser(
        description="MaybeBoudha deterministic Open3D Poisson reconstruction",
    )
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--source-report")
    parser.add_argument("--depth", type=int, default=9)
    parser.add_argument("--scale", type=float, default=1.08)
    parser.add_argument("--linear-fit", action="store_true")
    parser.add_argument("--density-quantile", type=float, default=0.02)
    parser.add_argument("--orient-k", type=int, default=30)
    parser.add_argument("--max-triangles", type=int, default=300_000)
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    manifest_path = Path(args.manifest)

    if not input_path.is_file():
        raise FileNotFoundError(input_path)

    if not 6 <= args.depth <= 12:
        raise ValueError("depth must be between 6 and 12")

    if not 1.0 <= args.scale <= 2.0:
        raise ValueError("scale must be between 1.0 and 2.0")

    if not 0.0 <= args.density_quantile < 0.25:
        raise ValueError("density quantile must be >=0 and <0.25")

    cloud = o3d.io.read_point_cloud(str(input_path))

    points = np.asarray(cloud.points)
    normals = np.asarray(cloud.normals)

    if len(points) == 0:
        raise RuntimeError("Open3D read zero source points.")

    if normals.shape != points.shape:
        raise RuntimeError("Source PLY does not contain one normal per point.")

    if not np.isfinite(points).all() or not np.isfinite(normals).all():
        raise RuntimeError("Source point cloud contains non-finite values.")

    normal_lengths = np.linalg.norm(normals, axis=1)
    if np.any(normal_lengths < 1e-8):
        raise RuntimeError("Source point cloud contains zero-length normals.")

    # Normalize lengths without inventing geometry. Orientation is then made
    # locally consistent using Open3D's deterministic tangent-plane routine.
    cloud.normalize_normals()

    if args.orient_k > 0:
        cloud.orient_normals_consistent_tangent_plane(args.orient_k)

    source_bounds = cloud.get_axis_aligned_bounding_box()
    source_min = np.asarray(source_bounds.min_bound)
    source_max = np.asarray(source_bounds.max_bound)
    source_extent = source_max - source_min

    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        cloud,
        depth=args.depth,
        width=0,
        scale=args.scale,
        linear_fit=args.linear_fit,
        n_threads=1,
    )

    if len(mesh.vertices) == 0 or len(mesh.triangles) == 0:
        raise RuntimeError("Poisson reconstruction produced an empty mesh.")

    densities_np = np.asarray(densities)

    if len(densities_np) != len(mesh.vertices):
        raise RuntimeError("Poisson density output does not match mesh vertices.")

    density_threshold = None
    removed_density_vertices = 0

    if args.density_quantile > 0:
        density_threshold = float(
            np.quantile(densities_np, args.density_quantile)
        )
        density_mask = densities_np < density_threshold
        removed_density_vertices = int(np.count_nonzero(density_mask))
        mesh.remove_vertices_by_mask(density_mask)

    # Crop the implicit Poisson envelope back to the observed source bounds
    # with a small margin so unsupported outer shells do not dominate.
    margin = np.maximum(source_extent * 0.02, 1e-6)
    crop_box = o3d.geometry.AxisAlignedBoundingBox(
        source_min - margin,
        source_max + margin,
    )
    mesh = mesh.crop(crop_box)

    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_duplicated_vertices()
    mesh.remove_non_manifold_edges()
    mesh.remove_unreferenced_vertices()
    mesh.compute_vertex_normals()

    triangles_before_simplification = len(mesh.triangles)
    simplified = False

    if (
        args.max_triangles > 0
        and triangles_before_simplification > args.max_triangles
    ):
        mesh = mesh.simplify_quadric_decimation(
            target_number_of_triangles=args.max_triangles,
            maximum_error=float("inf"),
            boundary_weight=1.0,
        )
        mesh.remove_degenerate_triangles()
        mesh.remove_duplicated_triangles()
        mesh.remove_duplicated_vertices()
        mesh.remove_unreferenced_vertices()
        mesh.compute_vertex_normals()
        simplified = True

    if len(mesh.vertices) == 0 or len(mesh.triangles) == 0:
        raise RuntimeError("Cleanup removed the reconstructed mesh.")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if not o3d.io.write_triangle_mesh(
        str(output_path),
        mesh,
        write_ascii=False,
        compressed=False,
        write_vertex_normals=True,
        write_vertex_colors=False,
        write_triangle_uvs=False,
    ):
        raise RuntimeError("Open3D failed to write reconstructed mesh.")

    output_bounds = mesh.get_axis_aligned_bounding_box()

    source_report = None
    if args.source_report:
        with Path(args.source_report).open("r", encoding="utf-8") as stream:
            source_report = json.load(stream)

    manifest = {
        "schemaVersion": 1,
        "source": {
            "path": str(input_path),
            "bytes": input_path.stat().st_size,
            "sha256": sha256(input_path),
            "pointCount": int(len(points)),
            "bounds": {
                "min": vector(source_min),
                "max": vector(source_max),
                "size": vector(source_extent),
            },
            "extractionReport": source_report,
        },
        "toolchain": {
            "python": platform.python_version(),
            "open3d": o3d.__version__,
            "numpy": np.__version__,
            "algorithm": "Open3D TriangleMesh.create_from_point_cloud_poisson",
        },
        "parameters": {
            "depth": args.depth,
            "scale": args.scale,
            "linearFit": args.linear_fit,
            "nThreads": 1,
            "orientNormalsConsistentTangentPlaneK": args.orient_k,
            "densityQuantile": args.density_quantile,
            "maxTriangles": args.max_triangles,
            "cropMarginFraction": 0.02,
        },
        "cleanup": {
            "densityThreshold": density_threshold,
            "removedDensityVertices": removed_density_vertices,
            "trianglesBeforeSimplification": int(
                triangles_before_simplification
            ),
            "simplified": simplified,
        },
        "output": {
            "path": str(output_path),
            "bytes": output_path.stat().st_size,
            "sha256": sha256(output_path),
            "vertexCount": int(len(mesh.vertices)),
            "triangleCount": int(len(mesh.triangles)),
            "bounds": {
                "min": vector(output_bounds.min_bound),
                "max": vector(output_bounds.max_bound),
                "size": vector(output_bounds.get_extent()),
            },
        },
    }

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", encoding="utf-8") as stream:
        json.dump(manifest, stream, indent=2)
        stream.write("\n")

    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
