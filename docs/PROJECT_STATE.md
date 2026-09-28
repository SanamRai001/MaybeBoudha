# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The current product track is exhausting strong legally reusable existing 3D sources before deciding whether new systematic field capture is worth the permission/provenance cost.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p4-surface-reconstruction`
- Pull request: `#9 — feat: Phase 3P.4 deterministic Boudhanath surface reconstruction`
- Working title: `MaybeBoudha`

## Last completed merged milestone

**Phase 3P.3 — Licensed Boudhanath point-cloud spike**

Status: **complete and merged**

PR:

`#7 — feat: Phase 3P.3 licensed Boudhanath point-cloud spike`

Merge SHA:

`54c724617751af6b595848bd74fe295d623e1718`

Phase 3P.2 hybrid remains the default visual experience.

## Current milestone

**Phase 3P.4 — Deterministic point-cloud surface reconstruction**

Status: **engineering proof complete on branch; final documentation verification pending**

Current verified implementation head before documentation closeout:

`40737bb5efeb0100a1bcb8c597533367b8517af3`

Verified on that head:

- CI #192 — green;
- Surface Reconstruction #15 — green;
- RAD Pipeline #106 — green;
- locked install — passed;
- tests — passed;
- production build — passed;
- source GLB checksum — passed;
- point/normal extraction — passed;
- deterministic Poisson reconstruction — passed;
- surface mesh validation — passed;
- reconstructed-surface Chromium probe — passed;
- Spark / PlayCanvas / RAD regressions — passed.

## Source asset

Repository file:

`boudhanath_stupa_-_pointcloud.glb`

Source:

- title: `BOUDHANATH STUPA - POINTCLOUD`;
- author: **Enea Le Fons / @enealefons**;
- Sketchfab UID: `ba7da7bbf6cc4ce9ab17ce66bc9597a1`;
- license shown by listing: Creative Commons Attribution;
- NoAI restriction: respected.

Verified source GLB:

- bytes: **4,002,328**;
- SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`;
- total points: **99,992**;
- triangles: **0**;
- normals: present;
- stored color: uniform gray, not photographic RGB.

## Phase 3P.4 pipeline

```text
unchanged source GLB
    ↓
deterministic glTF point/normal extraction
    ↓
oriented binary PLY
    ↓
Open3D 0.20.0 Poisson reconstruction
    ↓
density cleanup + source-bounds crop
    ↓
triangle simplification
    ↓
generated PLY
    ↓
Float64 → Float32 browser compatibility
    ↓
Three.js browser proof
```

No generative AI or model training is used.

## Extracted oriented points

- points: **99,992**
- PLY bytes: **2,400,037**
- SHA-256:
  `303e875cf2c059bf2a900292f7dd81c7ddd2aadcd27795f9cb7dcc62e601a8d8`

## Reconstruction parameters

Toolchain:

- Python 3.11;
- Open3D 0.20.0;
- NumPy 2.4.6.

Parameters:

- Poisson depth: **9**;
- scale: **1.08**;
- normal-consistency K: **30**;
- density quantile: **0.02**;
- max triangles: **220,000**;
- nThreads: **1**;
- crop margin: **0.02**.

## Generated surface

- vertices: **110,643**
- triangles: **220,000**
- PLY bytes: **8,171,130**
- SHA-256:
  `6f644e51d834a88f7b99d470575384b07810ea886d537c67feabdfba41b2101a`

Measured cleanup:

- triangles before simplification: **369,805**;
- low-density vertices removed: **3,796**.

## WebGL compatibility finding

Open3D emits generated PLY positions as 64-bit doubles.

Three.js can parse them, but WebGL cannot upload normal `Float64Array` vertex buffers.

Observed browser failure:

```text
THREE.WebGLAttributes: Unsupported buffer data format
```

Fix:

`src/surface/surfaceGeometry.ts`

The browser converts position/normal attributes to `Float32Array` before rendering and recomputes normals.

Regression coverage:

`src/surface/surfaceGeometry.test.ts`

The generated Poisson PLY itself remains unchanged.

## Browser evidence

Route:

`/?surface=1`

The corrected browser proof visibly renders the reconstructed Boudhanath surface.

The silhouette/dome/base are clearly recognizable.

## Phase 3P.4 A/B verdict

**Do not replace the Phase 3P.2 hybrid with the Poisson surface.**

The surface improves:

- continuous source-derived geometry;
- source-specific silhouette;
- usefulness as a geometric/reference layer.

It does not improve enough in:

- photographic surface realism;
- architectural micro-detail;
- eye/harmika fidelity;
- upper structure presentation;
- reconstructed ground/base cleanliness.

Keep:

- Phase 3P.2 hybrid as default;
- `/?pointcloud=1` as source evidence;
- `/?surface=1` as reconstructed-surface evidence;
- source GLB unchanged;
- deterministic reconstruction pipeline.

Detailed report:

`docs/SURFACE_RECONSTRUCTION_SPIKE.md`

## Next subphase after merge

**Phase 3P.5 — Selective geometry hybridization**

Goal:

Use selected reconstructed regions only where they materially improve the current hybrid.

Plan:

1. identify useful reconstructed geometry regions;
2. remove/crop broad reconstructed ground mass;
3. preserve current refined harmika/eyes/upper spire where visually stronger;
4. preserve photographic Boudhanath panorama;
5. preserve current materials and cinematic composition;
6. integrate source-derived geometry selectively;
7. run Chromium A/B against the current default;
8. keep or reject based on visible evidence.

If this final existing-source pass still cannot materially improve realism, Phase 3C.2 field clearance becomes the next serious route to true capture-derived fidelity.

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared but intentionally deferred.

Do not send permission emails yet.

## Resume rule

1. inspect PR #9 head and all workflow results;
2. read `docs/SURFACE_RECONSTRUCTION_SPIKE.md`;
3. repository state wins over documentation if they differ;
4. merge PR #9 only after final documentation head is green;
5. checkpoint actual merge SHA on `main`;
6. create `feat/phase-3p5-selective-hybrid` from verified main;
7. keep all source/license/NoAI provenance explicit.
