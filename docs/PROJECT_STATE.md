# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The strongest currently available existing-source geometry path has been exhausted far enough to make the remaining realism gap clearly a **source-data quality** issue rather than a missing renderer or modeling technique.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed milestone

**Phase 3P.6 — Real-capture go / no-go review**

Status: **complete**

Decision:

**NO-GO for field capture right now.**

Reason:

The current default is a strong Boudhanath-specific interactive prototype, but it is still visibly synthetic and does not meet the user's threshold for spending time on permission outreach and systematic capture.

Detailed decision:

`docs/REAL_CAPTURE_GO_NO_GO.md`

## Phase 3P.5 merge

PR:

`#10 — feat: Phase 3P.5 selective reconstructed geometry hybrid`

Merge SHA:

`613d6b9588a192ecc12cf3e8de758b5e601a6e4d`

Post-merge verification on that exact SHA:

- CI **#208** — green;
- Surface Reconstruction **#28** — green;
- RAD Pipeline **#119** — green;
- tests/build — passed;
- default hybrid probe — passed;
- uploaded MiniWorld model probe — passed;
- licensed point-cloud probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- paged-RAD regression — passed.

## Current strongest visual

Keep:

- `/` — Phase 3P.2 hybrid default;
- `/?pointcloud=1` — raw licensed point-source evidence;
- `/?surface=1` — full deterministic Poisson evidence;
- `/?selective=1` — selective-hybrid engineering evidence when the generated surface is staged.

Current default composition:

```text
MiniWorld3D lower monument
        +
refined synthetic upper monument
        +
licensed photographic eye treatment
        +
photographic Boudhanath courtyard environment
        +
animated prayer flags
        +
cinematic interaction
```

The default remains a **synthetic visual feasibility study**, not a scan or digital twin.

## Phase 3P.5 verdict

The selective Poisson dome/body improved source-specific geometry but did not improve the finished experience enough to replace the current hybrid.

Final selected surface:

- source triangles: **220,000**;
- retained triangles: **59,011**;
- crop: **7.10–23.45 m Y**;
- max radius: **19.70 m**.

Problems:

- rougher lower seam;
- no photographic RGB;
- weaker finished surface;
- no gain sufficient to offset the cleaner MiniWorld/hybrid body.

## Existing-source track conclusion

Already tested:

1. procedural Boudhanath geometry;
2. user-supplied MiniWorld3D STL;
3. hybrid STL + refined synthetic upper monument;
4. licensed photographic eye/environment imagery;
5. licensed 99,992-point Boudhanath GLB;
6. direct point-cloud rendering;
7. deterministic Poisson reconstruction;
8. selective source-derived dome/body integration.

Further hand-modeling or repeated cropping of the same monochrome point source has diminishing expected value.

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Do **not** send permission emails yet.

Re-open field capture only when:

- the user explicitly decides the project is worth that investment;
- a much stronger source opportunity appears;
- or the polished prototype becomes compelling enough that a real reconstruction is clearly justified.

## Current milestone

**Phase 3P.7 — Prototype polish and portfolio-ready release**

Status: **not started**

Goal:

Improve the strongest current hybrid as a finished interactive prototype without pretending the monument itself is photorealistic reconstruction.

Scope:

- cinematic entrance timing;
- camera composition;
- loading/reveal polish;
- responsive/mobile composition;
- interaction affordances;
- environment blending;
- prayer-flag motion;
- subtle atmosphere;
- optional ambient sound with explicit controls;
- performance profiling;
- accessibility;
- public deployment readiness;
- README screenshots/video.

Guardrails:

- do not restart procedural geometry experiments without new source evidence;
- do not reactivate field clearance automatically;
- preserve all source/license/NoAI provenance;
- keep technical Spark/RAD/point-cloud/surface evidence routes working;
- keep the default labeled honestly as a synthetic visual study.

## Next branch

`feat/phase-3p7-prototype-polish`

## Resume rule

1. inspect actual `main` and CI;
2. read `docs/REAL_CAPTURE_GO_NO_GO.md`;
3. repository state wins over docs if they differ;
4. create Phase 3P.7 only from verified `main`;
5. improve product presentation, not the monument geometry source;
6. run screenshot-based review at every visual checkpoint;
7. update this file at the Phase 3P.7 boundary.
