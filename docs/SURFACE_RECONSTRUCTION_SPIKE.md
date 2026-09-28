# Phase 3P.4 — Deterministic Surface Reconstruction Spike

## Purpose

Test whether the licensed 99,992-point Boudhanath source can produce a materially better surface mesh without new field capture.

This phase deliberately uses deterministic geometry processing only.

No generative AI, model training, or AI-assisted reconstruction is used.

## Source

Original repository asset:

`boudhanath_stupa_-_pointcloud.glb`

Source listing:

`BOUDHANATH STUPA - POINTCLOUD`

- author: **Enea Le Fons / @enealefons**
- Sketchfab UID: `ba7da7bbf6cc4ce9ab17ce66bc9597a1`
- license shown by public listing: **Creative Commons Attribution**
- NoAI restriction: **respected**

Original GLB remains unchanged.

Verified source:

- bytes: **4,002,328**
- SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`
- points: **99,992**
- point primitives: **2**
- normals: **present**
- triangles: **0**
- stored color: uniform gray, not photographic RGB

## Deterministic extraction

`scripts/surface/extract-pointcloud-ply.mjs`:

1. parses the original GLB;
2. applies authored glTF node transforms;
3. transforms normals using the inverse-transpose world matrix;
4. preserves one normal per point;
5. writes a binary little-endian oriented-point PLY;
6. writes an extraction manifest.

Verified extracted source:

- points: **99,992**
- PLY bytes: **2,400,037**
- SHA-256:
  `303e875cf2c059bf2a900292f7dd81c7ddd2aadcd27795f9cb7dcc62e601a8d8`

Transformed source bounds:

```text
min  [-22.21578, -1.61204, -22.20743]
max  [ 22.21632, 18.90940,  22.20743]
size [ 44.43210, 20.52144,  44.41486]
```

These are authored/transformed source coordinates. They are not claimed as survey-grade site measurements.

## Reconstruction toolchain

The isolated asset-processing workflow uses:

- Python **3.11**
- Open3D **0.20.0**
- NumPy **2.4.6**
- algorithm:
  `TriangleMesh.create_from_point_cloud_poisson`

Parameters:

```text
depth                9
scale                1.08
linear_fit           false
n_threads            1
orient_k             30
density_quantile     0.02
max_triangles        220000
crop_margin_fraction 0.02
```

The workflow runs separately from normal web-app CI.

## Cleanup

After Poisson reconstruction:

1. low-density vertices are removed;
2. output is cropped to the source bounds with a small margin;
3. disconnected geometry remains where supported by the source;
4. the result is simplified to the configured triangle ceiling when required;
5. vertex normals are recomputed;
6. the generated PLY and manifest are checksummed.

Measured cleanup:

- density threshold: ~**6.0964**
- removed density vertices: **3,796**
- triangles before simplification: **369,805**
- simplified: **yes**

## Generated surface

Final deterministic output:

- vertices: **110,643**
- triangles: **220,000**
- PLY bytes: **8,171,130**
- SHA-256:
  `6f644e51d834a88f7b99d470575384b07810ea886d537c67feabdfba41b2101a`

Output bounds size:

```text
[44.93961, 20.88573, 45.28646]
```

The generated mesh is a derived CC-attributed engineering artifact.

It is not a scan, digital twin, or survey-grade conservation model.

## Browser proof

Route:

```text
/?surface=1
```

The browser:

- loads the generated PLY with Three.js `PLYLoader`;
- normalizes height only for A/B presentation;
- recenters the mesh;
- exposes orbit / zoom;
- shows provenance and deterministic-processing disclosures;
- keeps the existing hybrid as the default route.

### Float64 compatibility finding

Open3D writes the generated PLY position data as 64-bit floating point values.

Three.js can parse those values, but WebGL cannot upload a `Float64Array` as a normal vertex buffer.

The first surface browser proof therefore failed with:

```text
THREE.WebGLAttributes: Unsupported buffer data format
```

MaybeBoudha now converts loaded PLY position/normal attributes to GPU-safe `Float32Array` attributes before rendering.

Regression coverage:

`src/surface/surfaceGeometry.test.ts`

This conversion affects only the browser representation. The generated Poisson PLY stays unchanged.

## Verification

Final corrected implementation head:

`40737bb5efeb0100a1bcb8c597533367b8517af3`

Verified on that head:

- normal CI tests/build — **passed**
- Float64 → Float32 regression test — **passed**
- source checksum gate — **passed**
- point extraction — **passed**
- deterministic Poisson reconstruction — **passed**
- mesh validation — **passed**
- reconstructed-surface Chromium probe — **passed**
- RAD regression — **passed**
- Spark/PlayCanvas application regressions — **passed**

Surface workflow:

`#15 — green`

## Visual A/B verdict

The reconstructed mesh is clearly recognizable as Boudhanath.

It improves:

- source-specific silhouette;
- dome/base geometry derived from the licensed point source;
- continuous surfaces instead of sparse point sprites;
- usefulness as a geometry/reference layer.

It does **not** improve enough to replace the Phase 3P.2 hybrid.

Visible limitations:

- no photographic surface color;
- broad ground/base mass is reconstructed into the mesh;
- architectural detail remains soft;
- eye/harmika detail is not visually strong enough;
- the upper structure is less convincing than the refined hybrid;
- a neutral material makes the result look like a scan-inspection mesh rather than a finished experience.

## Decision

**Do not make the Poisson mesh the default experience.**

Keep:

- Phase 3P.2 hybrid as the default;
- `/?pointcloud=1` as raw-source evidence;
- `/?surface=1` as reconstructed-surface evidence;
- the unchanged source GLB;
- the deterministic surface pipeline.

The Poisson mesh is valuable as a **geometric source**, not as the finished visual.

## Next phase

### Phase 3P.5 — Selective geometry hybridization

Before reactivating field-clearance outreach, test whether selected regions of the reconstructed mesh can improve the existing hybrid.

Target:

```text
Phase 3P.2 hybrid
    +
selected reconstructed geometry
    ↓
existing eye treatment
existing materials
existing photographic panorama
existing cinematic experience
    ↓
A/B screenshot
```

Rules:

1. do not replace visually stronger hybrid regions merely because reconstructed geometry exists;
2. remove/crop reconstructed ground mass that hurts composition;
3. use the surface only where source-specific geometry materially helps;
4. preserve attribution and NoAI restrictions;
5. keep all operations deterministic;
6. keep field-clearance emails deferred unless the existing-source path is exhausted.

If Phase 3P.5 still cannot achieve the desired realism, new capture becomes the next serious source-quality path rather than more procedural modeling.

## Exit criteria

Phase 3P.4 is complete when:

1. source points/normals are extracted reproducibly — **met**
2. deterministic surface is generated — **met**
3. generated mesh is checksummed/documented — **met**
4. browser renders it successfully — **met**
5. A/B decision is explicit — **met**
6. hybrid/default decision is preserved — **met**

**Phase 3P.4 result: successful engineering experiment; rejected as the default visual.**
