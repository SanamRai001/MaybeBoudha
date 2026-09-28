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

## Last completed milestone

**Phase 3P.4 — Deterministic point-cloud surface reconstruction**

Status: **complete and merged**

PR:

`#9 — feat: Phase 3P.4 deterministic Boudhanath surface reconstruction`

Merge SHA:

`6c9f01416ad6f510c8c68f2c0ecc200d50006529`

Final pre-merge verification on documentation-complete head:

- CI **#194** — green;
- Surface Reconstruction **#17** — green;
- RAD Pipeline **#108** — green;
- tests/build — passed;
- hybrid browser probe — passed;
- uploaded-model browser probe — passed;
- point-cloud browser probe — passed;
- reconstructed-surface browser probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- paged-RAD regression — passed.

## Phase 3P.4 result

Source:

- `boudhanath_stupa_-_pointcloud.glb`
- **99,992** points
- normals present
- uniform gray source color
- Creative Commons Attribution
- NoAI restriction respected.

Deterministic pipeline:

```text
source GLB
    ↓
point + normal extraction
    ↓
Open3D 0.20.0 Poisson depth 9
    ↓
density cleanup / bounds crop
    ↓
220k-triangle generated PLY
    ↓
Float64 → Float32 browser compatibility
    ↓
Three.js browser proof
```

Generated surface:

- vertices: **110,643**
- triangles: **220,000**
- bytes: **8,171,130**
- SHA-256:
  `6f644e51d834a88f7b99d470575384b07810ea886d537c67feabdfba41b2101a`

### Verdict

**Do not replace the Phase 3P.2 hybrid with the reconstructed surface.**

The surface is recognizable and useful as source-derived geometry, but it does not beat the hybrid in photographic realism, architectural detail, eye/harmika fidelity, upper-structure presentation, or ground/base cleanliness.

Keep:

- default Phase 3P.2 hybrid;
- `/?pointcloud=1` as source evidence;
- `/?surface=1` as reconstructed-surface evidence;
- deterministic reconstruction pipeline.

Detailed report:

`docs/SURFACE_RECONSTRUCTION_SPIKE.md`

## Current milestone

**Phase 3P.5 — Selective geometry hybridization**

Status: **not started**

Goal:

Use reconstructed geometry only where it materially improves the current hybrid.

Plan:

1. identify useful reconstructed regions;
2. remove/crop broad reconstructed ground mass;
3. preserve the current refined harmika / photographic eye treatment / upper spire where stronger;
4. preserve the photographic courtyard panorama;
5. preserve current material and cinematic treatment;
6. integrate only beneficial source-derived geometry;
7. run a deterministic Chromium A/B;
8. keep or reject based on visible evidence.

Guardrails:

- no generative AI;
- no AI training/model development;
- preserve source GLB unchanged;
- retain CC attribution and NoAI handling;
- do not replace stronger hybrid regions just because reconstructed geometry exists;
- do not call the result survey-grade.

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared but intentionally deferred.

Do not send permission emails yet.

If Phase 3P.5 still does not materially improve realism, field clearance / new capture becomes the next serious source-quality route rather than further procedural modeling.

## Next branch

`feat/phase-3p5-selective-hybrid`

## Resume rule

1. inspect actual `main` and CI;
2. read `docs/SURFACE_RECONSTRUCTION_SPIKE.md`;
3. repository state wins over documentation if they differ;
4. create Phase 3P.5 only from verified main;
5. preserve all source/license/NoAI provenance;
6. make the A/B decision from screenshots, not code alone;
7. update this file at the Phase 3P.5 boundary.
