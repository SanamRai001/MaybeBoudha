# Phase 3P.5 — Selective Geometry Hybridization

## Purpose

Phase 3P.5 tested whether the deterministic Poisson reconstruction from the licensed Boudhanath point cloud could improve only the strongest geometric regions of the current Phase 3P.2 hybrid.

The goal was explicitly **not** to replace the whole monument.

Target composition:

```text
MiniWorld3D detailed plinth/base
        +
selected point-cloud-derived dome/body
        +
existing photographic eye treatment
        +
existing refined harmika / upper spire
        +
existing photographic Boudhanath surroundings
        ↓
deterministic Chromium A/B
```

No generative AI, AI training, or model development was used.

## Source

The selective mesh is derived from the same Phase 3P.4 deterministic Poisson reconstruction:

- original GLB: `boudhanath_stupa_-_pointcloud.glb`;
- source author: Enea Le Fons / `@enealefons`;
- source points: **99,992**;
- source normals: present;
- source license: Creative Commons Attribution;
- source NoAI restriction: respected;
- Poisson surface: **110,643 vertices / 220,000 triangles**.

The source GLB remains unchanged.

## Selection strategy

The generated Poisson PLY is normalized to the same **43.25 m visual presentation height** used by the existing prototype.

The final deterministic crop keeps only triangles whose **entire triangle** lies within:

```text
minimum Y     7.10 m
maximum Y    23.45 m
maximum radius 19.70 m
```

This intentionally rejects:

- broad reconstructed ground mass;
- low noisy fringe around the monument;
- reconstructed harmika / upper spire where the current hybrid is stronger;
- triangles crossing the crop boundary.

The MiniWorld3D browser model is independently cropped to a **0.19 source-height fraction** for the detailed plinth/base.

## Final measured selection

Surface Reconstruction workflow **#23** reported:

- source triangles: **220,000**;
- selected triangles: **59,011**;
- normalized scale: **2.0707919910043135**;
- source size:
  `[44.939613342285156, 20.88572883605957, 45.28645896911621]`.

The resulting selected mesh uses a neutral/plaster physical material so the visual comparison focuses on geometry rather than introducing a different stylistic treatment.

## Browser proof

A dedicated route is available during the generated-surface workflow:

```text
/?selective=1
```

The route waits for both:

1. the cropped MiniWorld3D base; and
2. the generated selective Poisson dome/body

before reporting ready.

Verified on final implementation head:

`de6fb70c26f008592d4c04ea50d06d2c92f12bce`

Final verification:

- CI **#203** — green;
- Surface Reconstruction **#23** — green;
- RAD Pipeline **#114** — green;
- tests/build — passed;
- default hybrid browser probe — passed;
- MiniWorld model probe — passed;
- point-cloud probe — passed;
- standalone surface probe — passed;
- selective-hybrid probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- paged-RAD regression — passed.

## Visual A/B

Two selection passes were reviewed.

### Pass 1

Region:

```text
minY       5.60
maxY      23.70
maxRadius 20.75
```

Selected:

**60,488 triangles**

Result:

- dome/body was recognizably source-derived;
- lower transition was visibly torn/noisy;
- reconstructed fringe hurt the clean plinth silhouette;
- worse than the Phase 3P.2 default.

### Final refined pass

Region:

```text
minY       7.10
maxY      23.45
maxRadius 19.70
```

Selected:

**59,011 triangles**

Improvements:

- cleaner lower crop;
- less broad reconstructed fringe;
- smoother source-derived dome;
- existing eyes/harmika/spire remain visually stronger.

Remaining problems:

- lower dome/base transition still shows visible irregularity;
- source-derived dome lacks photographic surface information;
- geometric smoothness does not compensate for the seam/noise;
- the Phase 3P.2 MiniWorld/hybrid body remains visually cleaner as a finished experience.

## Decision

**Reject the selective Poisson geometry as the default visual.**

Keep:

- **Phase 3P.2 hybrid as the default `/` experience**;
- `/?pointcloud=1` as raw-source evidence;
- `/?surface=1` as full reconstructed-surface evidence;
- `/?selective=1` as selective-hybrid engineering evidence when the generated surface is staged;
- the deterministic extraction/reconstruction/crop pipeline.

Do **not**:

- switch the default to the Poisson dome;
- describe the selective mesh as survey-grade;
- claim that the existing point source achieved photorealistic reconstruction.

## What Phase 3P.5 established

The remaining realism gap is now primarily a **source-quality problem**, not a lack of procedural modeling effort.

The project has already tested:

1. procedural monument geometry;
2. a licensed artistic STL;
3. hybrid STL/procedural geometry;
4. photographic eye/environment references;
5. a licensed ~100k point Boudhanath source;
6. deterministic Poisson reconstruction;
7. selective source-derived geometry.

Further hand-modeling or further cropping of this same monochrome point source has diminishing expected value.

## Next decision

The strongest current visual remains the Phase 3P.2 hybrid.

Before spending time on permissions or new field capture, the user should review that experience and decide:

> Is the project promising enough to justify acquiring genuinely better real-world source data?

If **yes**, reactivate the prepared Phase 3C.2 field-clearance path and pursue a controlled partial capture.

If **no**, keep the current project as a visual/engineering prototype without spending additional field-capture effort.

Do not send permission outreach automatically.
