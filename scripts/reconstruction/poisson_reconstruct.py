#!/usr/bin/env python3
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
import open3d as o3d


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Deterministic Open3D Poisson reconstruction for MaybeBoudha."
    )
    parser.add_argument("input_ply", type=Path)
    parser.add_argument("output_ply", type=Path)
    parser.add_argument("manifest_json", type=Path)
    parser.add_argument("--depth", type=int, default=8)
    parser.add_argument("--scale", type=float, default=1.08)
    parser.add_argument("--density-quantile", type=float, default=0.02)
    parser.add_argument("--crop-margin", type=float, default=0.02)
    args = parser.parse_args()

    cloud = o3d.io.read_point_cloud(str(args.input_ply))

    if cloud.is_empty():
        raise RuntimeError("Extracted point cloud is empty.")
    if not cloud.has_normals():
        raise RuntimeError("Poisson reconstruction requires source normals.")

    cloud.normalize_normals()

    points = np.asarray(cloud.points)
    normals = np.asarray(cloud.normals)

    if not np.isfinite(points).all() or not np.isfinite(normals).all():
        raise RuntimeError("Point cloud contains non-finite values.")

    source_bounds = cloud.get_axis_aligned_bounding_box()
    source_min = np.asarray(source_bounds.min_bound)
    source_max = np.asarray(source_bounds.max_bound)
    source_extent = source_max - source_min

    # n_threads=1 makes the reconstruction execution path reproducible across
    # the hosted CI proof. The source normals are preserved rather than
    # re-estimated so this phase measures the supplied asset itself.
    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        cloud,
        depth=args.depth,
        width=0,
        scale=args.scale,
        linear_fit=False,
        n_threads=1,
    )

    densities = np.asarray(densities)

    if len(mesh.vertices) == 0 or len(mesh.triangles) == 0:
        raise RuntimeError("Poisson reconstruction produced an empty mesh.")

    density_threshold = float(
        np.quantile(densities, args.density_quantile)
    )
    mesh.remove_vertices_by_mask(densities < density_threshold)

    margin = source_extent * args.crop_margin
    crop_box = o3d.geometry.AxisAlignedBoundingBox(
        source_min - margin,
        source_max + margin,
    )
    mesh = mesh.crop(crop_box)

    mesh.remove_duplicated_vertices()
    mesh.remove_duplicated_triangles()
    mesh.remove_degenerate_triangles()
    mesh.remove_unreferenced_vertices()
    mesh.compute_vertex_normals(normalized=True)

    if len(mesh.vertices) == 0 or len(mesh.triangles) == 0:
        raise RuntimeError("Cleanup removed the entire reconstructed mesh.")

    args.output_ply.parent.mkdir(parents=True, exist_ok=True)
    wrote = o3d.io.write_triangle_mesh(
        str(args.output_ply),
        mesh,
        write_ascii=False,
        compressed=False,
        write_vertex_normals=True,
        write_vertex_colors=False,
        write_triangle_uvs=False,
    )

    if not wrote:
        raise RuntimeError("Open3D failed to write the reconstructed mesh.")

    output_bounds = mesh.get_axis_aligned_bounding_box()

    manifest = {
        "schemaVersion": 1,
        "tool": {
            "name": "Open3D",
            "version": o3d.__version__,
            "method": "create_from_point_cloud_poisson",
        },
        "parameters": {
            "depth": args.depth,
            "width": 0,
            "scale": args.scale,
            "linearFit": False,
            "nThreads": 1,
            "densityQuantile": args.density_quantile,
            "cropMarginFraction": args.crop_margin,
            "normalPolicy": "source normals normalized; no re-estimation",
        },
        "input": {
            "path": str(args.input_ply),
            "bytes": args.input_ply.stat().st_size,
            "sha256": sha256(args.input_ply),
            "points": int(len(cloud.points)),
            "bounds": {
                "min": source_min.tolist(),
                "max": source_max.tolist(),
                "size": source_extent.tolist(),
            },
        },
        "poisson": {
            "verticesBeforeTrim": int(len(densities)),
            "densityThreshold": density_threshold,
        },
        "output": {
            "path": str(args.output_ply),
            "bytes": args.output_ply.stat().st_size,
            "sha256": sha256(args.output_ply),
            "vertices": int(len(mesh.vertices)),
            "triangles": int(len(mesh.triangles)),
            "bounds": {
                "min": np.asarray(output_bounds.min_bound).tolist(),
                "max": np.asarray(output_bounds.max_bound).tolist(),
                "size": np.asarray(output_bounds.get_extent()).tolist(),
            },
        },
    }

    args.manifest_json.parent.mkdir(parents=True, exist_ok=True)
    args.manifest_json.write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
