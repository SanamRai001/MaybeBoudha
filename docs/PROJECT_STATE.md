# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering and delivery architecture is proven. The current product track is validating the strongest legally reusable real-data source available before deciding whether a new systematic field capture is worth the permission/provenance cost.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed milestone

**Phase 3P.2 — Realism and material pass**

Status: **complete and merged**

PR:

`#6 — feat: Phase 3P synthetic Boudhanath visual prototype`

Final visual implementation head:

`27e422c4f2df863ea8d69955c17cc8b1576aba8b`

Final documentation-complete PR head:

`8be8bcc74642b6fffc82147b63823718ebeedabf`

Merge SHA:

`3ff3d7bbeb4175f02f5fdcde758ca30864e43643`

Final PR verification:

- CI #153 — green;
- locked install — passed;
- tests — passed;
- production build — passed;
- default hybrid visual probe — passed;
- explicit uploaded-model probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- RAD Pipeline #80 — green;
- generated paged RAD runtime — passed.

The final material-balanced visual artifact was directly inspected from the earlier visual implementation run and accepted as the Phase 3P.2 baseline.

## Phase 3P.2 result

The default experience is now hybrid:

```text
user-supplied MiniWorld3D Boudhanath STL
        ↓
compact MBV2 browser package
        ↓
detailed lower monument / dome
        +
refined procedural upper monument
        +
licensed Buddha-eye photograph
        +
public-domain Boudhanath courtyard panorama
        +
Three.js lighting / motion / camera
```

Source STL facts:

- bytes: **727,784**;
- triangles: **14,554**;
- indexed browser vertices: **7,281**;
- source SHA-256:
  `26056855d10d51b9af31bf75cd7eebca0ab161a70c8aeafb664b7e0df621d5e9`.

The scene also includes:

- deterministic plaster weathering;
- photo-textured eye façade;
- thirteen-stage spire;
- prayer wheels;
- animated flags;
- contact grounding;
- photographic Boudhanath surroundings;
- cinematic camera;
- orbit/zoom;
- reduced-motion support;
- explicit no-scan disclosure.

## Visual verdict

**Keep the project. Stop spending more time hand-modeling this monument.**

The prototype now proves the experiential idea.

Remaining realism gap:

- monument is still not capture-derived;
- MiniWorld3D geometry is a printable artistic interpretation;
- weathering is generated;
- upper monument remains procedural;
- 3D and panorama do not share calibrated source cameras;
- no scan-level microgeometry/occlusion.

Therefore the next realism jump should come from **real licensed point data**, not more procedural modeling.

## Current milestone

**Phase 3P.3 — Licensed Boudhanath point-cloud spike**

Status: **not started**

Candidate:

- Sketchfab title: `BOUDHANATH STUPA - POINTCLOUD`;
- model UID: `ba7da7bbf6cc4ce9ab17ce66bc9597a1`;
- author: Enea Le Fons / `@enealefons`;
- public listing indicates downloadable;
- public listing indicates CC Attribution;
- approximately 100k vertices / 0 triangles;
- NoAI restriction must be respected.

## Phase 3P.3 rules

1. Treat the point cloud only as a visual 3D asset.
2. Do not use it for AI training, model development, or generative-AI input.
3. Preserve source/license/download metadata.
4. Keep the original archive/file checksum.
5. Inspect actual file format, per-point color, orientation, scale, and completeness.
6. Test direct Three.js points before destructive conversion.
7. Convert to PLY only if technically useful.
8. Compare against the merged Phase 3P.2 hybrid.
9. Keep the hybrid scene as fallback.
10. Do not claim survey-grade accuracy unless the source itself supports it.

## External blocker possibility

The public Sketchfab model page is visible, but the downloadable asset may require an authenticated Sketchfab account.

Try to obtain it through normal public/downloadable routes first.

If authenticated download is required and no connected authorized tool can retrieve it, ask the user to download the original asset and upload the archive here.

Do **not** bypass access controls.

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared but intentionally deferred.

Do not send the permission emails yet.

Do not begin a new systematic Boudhanath capture yet.

Reactivate field clearance only if Phase 3P.3 fails to provide the realism/value needed from existing licensed data.

## Next branch

`feat/phase-3p3-point-cloud-spike`

## Resume rule

1. verify actual `main` and post-merge CI;
2. create `feat/phase-3p3-point-cloud-spike` from verified main;
3. obtain/inspect the licensed point-cloud asset;
4. keep provenance/licensing explicit;
5. compare with the merged hybrid;
6. update this file at the Phase 3P.3 boundary.
