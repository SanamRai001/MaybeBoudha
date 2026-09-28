# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The project has now tested the strongest available existing-source geometry path far enough to make the next step a deliberate real-capture go/no-go decision.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p5-selective-hybrid`
- Pull request: `#10 — feat: Phase 3P.5 selective reconstructed geometry hybrid`
- Working title: `MaybeBoudha`

## Current milestone

**Phase 3P.5 — Selective geometry hybridization**

Status: **engineering implementation and visual A/B complete; final documentation/merge pending**

Final implementation head:

`de6fb70c26f008592d4c04ea50d06d2c92f12bce`

Final verification on that implementation head:

- CI **#203** — green;
- Surface Reconstruction **#23** — green;
- RAD Pipeline **#114** — green;
- tests/build — passed;
- default hybrid probe — passed;
- uploaded MiniWorld model probe — passed;
- licensed point-cloud probe — passed;
- standalone reconstructed-surface probe — passed;
- selective-hybrid probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- paged-RAD regression — passed.

## Phase 3P.5 composition tested

```text
MiniWorld3D plinth/base
        +
deterministic Poisson dome/body
        +
existing photographic eye treatment
        +
existing refined harmika / 13-stage spire
        +
existing photographic Boudhanath surroundings
```

The source GLB remained unchanged and its CC Attribution / NoAI handling was preserved.

No generative AI, AI training, or model development was used.

## Final selective geometry

The source surface contains:

- **220,000 triangles**.

Final deterministic selection:

- **59,011 triangles**;
- normalized scale: **2.0707919910043135**;
- source size:
  `[44.939613342285156, 20.88572883605957, 45.28645896911621]`;
- minimum Y: **7.10 m**;
- maximum Y: **23.45 m**;
- maximum radius: **19.70 m**.

The selection requires each retained triangle to fit entirely inside the configured region, avoiding the earlier centroid-based fringe.

Detailed report:

`docs/SELECTIVE_HYBRID_SPIKE.md`

## Visual verdict

**Do not replace the Phase 3P.2 hybrid.**

The source-derived dome improves:

- source-specific geometry;
- smoothness/continuity of the dome/body;
- evidence that the point source can contribute usable local geometry.

It does not improve enough because:

- the lower dome/base seam remains visually rougher than the current hybrid;
- the source has no photographic RGB;
- fine monument detail is still missing;
- the current MiniWorld/hybrid base is visually cleaner;
- the current photographic eye/harmika/spire treatment remains stronger.

Keep:

- `/` — Phase 3P.2 hybrid default;
- `/?pointcloud=1` — raw licensed point-source evidence;
- `/?surface=1` — full deterministic Poisson evidence;
- `/?selective=1` — selective-hybrid evidence when the generated surface is staged;
- deterministic extraction/reconstruction/selection tooling.

## Existing-source track conclusion

The project has now tested:

1. procedural Boudhanath geometry;
2. user-supplied MiniWorld3D STL;
3. hybrid STL + refined procedural upper monument;
4. licensed photographic eye/environment imagery;
5. licensed 99,992-point Boudhanath GLB;
6. deterministic Poisson surface reconstruction;
7. selective source-derived dome/body integration.

Further hand-modeling or repeated cropping of the same monochrome point source has diminishing expected value.

The remaining large realism gap is a **source-data quality problem**.

## Next milestone after merge

**Phase 3P.6 — Real-capture go/no-go review**

Status: **not started**

Question:

> Is the current MaybeBoudha experience promising enough to justify acquiring a genuinely better real-world source dataset?

If **GO**:

- deliberately reactivate Phase 3C.2;
- obtain written clearance/determinations;
- perform only a small controlled partial capture first;
- keep raw imagery private;
- run the already-proven PLY → RAD pipeline.

If **NO-GO**:

- keep the current hybrid as the finished visual/engineering prototype;
- do not spend additional time on field capture or permission outreach.

## Field-clearance rule

Phase **3C.2 — Field clearance** remains prepared but deferred.

**Do not send permission emails automatically.**

The user explicitly decides whether the current project quality justifies that next investment.

## Resume rule

1. inspect actual `main`, PR #10, and CI;
2. read `docs/SELECTIVE_HYBRID_SPIKE.md`;
3. repository state wins over documentation if they differ;
4. merge PR #10 only if documentation-complete head remains green;
5. checkpoint the actual merge SHA on `main`;
6. next conversation should begin with the Phase 3P.6 visual go/no-go review;
7. do not restart procedural geometry work unless new source evidence justifies it.
