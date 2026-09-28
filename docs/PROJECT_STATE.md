# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The current product track is exhausting strong legally reusable existing 3D sources before deciding whether new systematic field capture is worth the permission/provenance cost.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed merged milestone

**Phase 3P.3 — Licensed Boudhanath point-cloud spike**

Status: **complete and merged**

PR:

`#7 — feat: Phase 3P.3 licensed Boudhanath point-cloud spike`

Merge SHA:

`54c724617751af6b595848bd74fe295d623e1718`

Final documentation-complete verification:

- CI **#171** — green;
- GLB inspection — passed;
- tests — passed;
- production build — passed;
- hybrid browser probe — passed;
- uploaded-model browser probe — passed;
- point-cloud browser probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- RAD Pipeline **#89** — green.

Phase 3P.2 hybrid remains the default visual experience.

## Current milestone

**Phase 3P.4 — Deterministic point-cloud surface reconstruction**

Status: **not started**

## Source asset

Repository file:

`boudhanath_stupa_-_pointcloud.glb`

Source listing:

`BOUDHANATH STUPA - POINTCLOUD`

Author:

**Enea Le Fons / @enealefons**

Sketchfab UID:

`ba7da7bbf6cc4ce9ab17ce66bc9597a1`

Public listing:

- Creative Commons Attribution;
- downloadable;
- NoAI restriction.

NoAI is respected: the asset is used only for deterministic file inspection, 3D rendering, and proposed deterministic geometry processing.

## Verified source facts

Deterministic GLB inspection:

- bytes: **4,002,328**
- SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`
- glTF: **2.0**
- generator: **Sketchfab-12.68.0**
- meshes: **2**
- point primitives: **2**
- total points: **99,992**
- triangles: **0**
- normals: **present**
- required glTF extensions: **none**

Point split:

- 65,535
- 34,457

### Color limitation

`COLOR_0` exists, but every point is the same RGBA value:

```text
[0.8, 0.8, 0.8, 1.0]
```

Therefore the file does **not** contain photographic per-point RGB.

Do not describe it as a colored scan.

## Browser spike

Route:

`/?pointcloud=1`

The browser:

- loads the original GLB directly with Three.js `GLTFLoader`;
- preserves the source file unchanged;
- computes scene bounds after glTF node transforms;
- uniformly normalizes height only for A/B viewing;
- recenters the scene;
- supports orbit / zoom;
- displays source provenance and NoAI status.

Because source color is uniform gray, the final inspection pass uses deterministic normal-based surfel shading to reveal shape.

The UI explicitly labels source color as **uniform gray**.

## Verification

Implementation head:

`32cdd2601a3c91b8c8228df279a917208c113a45`

CI:

`#168 — green`

Verified:

- GLB structural inspection — passed;
- locked install — passed;
- tests — passed;
- production build — passed;
- default hybrid browser probe — passed;
- uploaded-model browser probe — passed;
- point-cloud browser probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed.

The direct and normal-shaded point-cloud screenshots were manually inspected.

## Phase 3P.3 verdict

**Do not replace the current hybrid with the point cloud.**

Why:

- geometry/silhouette is useful;
- normals make the source valuable for reconstruction experiments;
- raw/styled point rendering remains visibly sparse;
- the GLB has no photographic RGB;
- close-range surface realism is worse than the Phase 3P.2 hybrid;
- no source evidence supports survey-grade accuracy.

Keep:

- default hybrid experience;
- `/?pointcloud=1` as an evidence/debug route;
- source GLB as a licensed geometric input.

## Phase 3P.4 goal

Goal:

Test whether the 99,992 licensed points + normals can produce materially better surface geometry without new field capture.

Proposed path:

```text
unchanged source GLB
    ↓
reproducible point extraction
    ↓
deterministic Poisson / equivalent reconstruction
    ↓
generated mesh cleanup/crop
    ↓
existing MaybeBoudha materials / eye / panorama
    ↓
A/B against Phase 3P.2
```

Rules:

1. no generative AI;
2. no AI training/model development;
3. preserve original GLB and checksum;
4. record reconstruction tool/version/parameters;
5. generated mesh remains a derived CC-attributed artifact;
6. do not claim survey accuracy;
7. keep hybrid as fallback until visual evidence wins.

Next branch:

`feat/phase-3p4-surface-reconstruction`

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared but intentionally deferred.

Do not send permission emails yet.

Reactivate it if Phase 3P.4 still cannot provide the realism/value needed from existing licensed sources.

## Resume rule

1. verify actual `main` and post-merge CI;
2. read `docs/POINT_CLOUD_SPIKE.md`;
3. repository state wins over docs if they differ;
4. create `feat/phase-3p4-surface-reconstruction` from verified main;
5. keep the source GLB unchanged;
6. perform only deterministic surface reconstruction;
7. update this file at the Phase 3P.4 boundary.
