# Phase 3P.3 — Licensed Boudhanath Point-Cloud Spike

## Purpose

Test whether an existing licensed Boudhanath point cloud can provide the realism jump that Phase 3P.2 cannot reach through more hand-modeling.

This phase intentionally happens before reactivating field-clearance outreach.

## Source

Sketchfab listing:

`BOUDHANATH STUPA - POINTCLOUD`

- model UID: `ba7da7bbf6cc4ce9ab17ce66bc9597a1`
- author: **Enea Le Fons / @enealefons**
- source: https://sketchfab.com/3d-models/boudhanath-stupa-pointcloud-ba7da7bbf6cc4ce9ab17ce66bc9597a1
- license shown by the public listing: **Creative Commons Attribution**
- restriction: **NoAI**

The user obtained the downloadable asset through the normal Sketchfab route and pushed the GLB to the repository.

Repository source file:

`boudhanath_stupa_-_pointcloud.glb`

## Source-file verification

Deterministic CI inspection reports:

- bytes: **4,002,328**
- SHA-256: `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`
- container: **glTF 2.0 GLB**
- generator: **Sketchfab-12.68.0**
- JSON chunk: **2,620 bytes**
- BIN chunk: **3,999,680 bytes**
- scenes: **1**
- nodes: **4**
- meshes: **2**
- point primitives: **2**
- total points: **99,992**
- triangles: **0**
- required extensions: **none**

The original GLB remains unchanged.

## Actual attribute data

Both point primitives contain:

- `POSITION`
- `NORMAL`
- `COLOR_0`

Point split:

- primitive 1: **65,535**
- primitive 2: **34,457**

### Color finding

The GLB technically contains `COLOR_0`, but it is **not photographic per-point RGB**.

For both primitives:

```text
min RGBA = [0.8, 0.8, 0.8, 1.0]
max RGBA = [0.8, 0.8, 0.8, 1.0]
```

Therefore every stored point color is the same gray.

This is the most important limitation of the asset.

### Normals

Normals are present for all points.

That makes deterministic normal-based visualization and later geometric surface reconstruction technically possible.

## Coordinate/orientation finding

The source accessors have large authored coordinates, while the root `Sketchfab_model` node applies a uniform scale and axis rotation.

The asset is therefore treated as an authored/local coordinate system, not evidence of survey-grade units.

For the A/B browser spike, MaybeBoudha:

1. preserves the source GLB unchanged;
2. lets glTF node transforms apply normally;
3. computes the loaded scene bounds;
4. uniformly rescales the scene for visual comparison against a 43.25 m monument target;
5. recenters X/Z and places the minimum Y at ground level.

That normalization is presentation-only and must not be described as recovered real-world measurement.

## Browser integration

Route:

```text
/?pointcloud=1
```

Implementation:

- direct Three.js `GLTFLoader`;
- no conversion to Gaussian Splat;
- no destructive rewrite of the source;
- orbit / zoom;
- reduced-motion support;
- explicit source/license/NoAI disclosure;
- Chromium screenshot gate;
- existing hybrid / Spark / PlayCanvas regressions preserved.

## Visual passes

### Pass 1 — raw point display

The first browser proof used direct point rendering.

Result:

- geometry loaded correctly;
- silhouette and outer structure were visible;
- point cloud remained obviously pointillist;
- uniform gray color made the result visually flat;
- it did **not** beat the Phase 3P.2 hybrid.

### Pass 2 — deterministic normal shading

Because the source includes normals but only uniform gray color, a second inspection renderer was added.

It uses:

- source point positions;
- source normals;
- circular point sprites;
- deterministic normal-based lighting;
- simple height bands only to make architectural regions readable.

The UI explicitly states that source color is uniform gray.

No photographic color is invented and no generative-AI processing is used.

Implementation head:

`32cdd2601a3c91b8c8228df279a917208c113a45`

Verification:

- CI **#168** — green;
- GLB structural inspection — passed;
- tests — passed;
- production build — passed;
- default hybrid screenshot — passed;
- uploaded-model screenshot — passed;
- point-cloud screenshot — passed;
- Spark regression — passed;
- PlayCanvas regression — passed.

## A/B verdict

### What the point cloud improves

- source-specific Boudhanath geometry;
- useful overall silhouette;
- real point topology rather than hand-authored polygon approximation;
- full normal data;
- enough density to justify deterministic surface reconstruction experiments;
- small source size at ~3.82 MiB.

### What it does not improve

- no photographic surface color;
- point rendering is visibly sparse/pointillist;
- eye/façade detail is not encoded as usable RGB;
- close-range realism is worse than the current hybrid;
- no evidence supports survey-grade accuracy;
- original capture/reconstruction method is not established by the GLB itself.

## Decision

**Do not replace the Phase 3P.2 hybrid with the raw/styled point cloud.**

Keep the hybrid as the default experience.

Keep `/?pointcloud=1` as an evidence/debug route.

The point cloud is valuable primarily as a **licensed geometric source** because it contains almost 100k points plus normals.

## Next phase

### Phase 3P.4 — Deterministic surface reconstruction spike

Before asking for real-world capture permission, test whether this point cloud can produce a materially better surface geometry.

Proposed deterministic path:

```text
source GLB points + normals
        ↓
reproducible point extraction
        ↓
Poisson / equivalent deterministic surface reconstruction
        ↓
crop / clean generated mesh
        ↓
existing MaybeBoudha material + eye + panorama treatment
        ↓
A/B against Phase 3P.2 hybrid
```

Guardrails:

- no AI training;
- no generative-AI processing;
- preserve original GLB unchanged;
- generated mesh is a derivative engineering artifact;
- retain source attribution;
- document reconstruction parameters;
- do not call the result survey-grade.

If Phase 3P.4 still does not provide a major realism jump, re-evaluate Phase 3C.2 field clearance as the next meaningful source-acquisition step.

## Exit criteria

Phase 3P.3 exit criteria are met:

1. source GLB preserved and checksummed — **met**
2. actual format/content documented — **met**
3. direct browser rendering — **met**
4. A/B screenshot exists — **met**
5. limitations documented — **met**
6. explicit decision made — **met**

**Phase 3P.3 status: engineering complete on PR #7; final documentation verification and merge pending.**
