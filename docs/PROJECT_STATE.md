# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. Existing-source geometry experiments have reached diminishing returns, so current work is polishing the strongest honest hybrid rather than claiming reconstruction quality the source data cannot support.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3P.7C — Environment, atmosphere and performance polish**

Status: **complete and merged**

PR:

`#13 — feat: Phase 3P.7C atmosphere and performance polish`

Merge SHA:

`634442bdc5636ecd9769ab2b6378470e35f1441f`

Documentation-complete head:

`83106592c0cfc1f17d369e910cd30c969efae9d1`

Green on that head:

- CI **#234**
- RAD Pipeline **#131**
- Surface Reconstruction **#40**

Detailed evidence:

`docs/PHASE_3P7C_ATMOSPHERE_PERFORMANCE.md`

## Current strongest visual

Default route:

`/`

Composition:

```text
MiniWorld3D lower monument
        +
refined synthetic upper monument
        +
licensed photographic eye treatment
        +
photographic Boudhanath courtyard environment
        +
quality-aware animated prayer flags
        +
cinematic / resettable orbit interaction
```

This remains a **synthetic visual feasibility study**, not a scan or digital twin.

## GLB / source status

The uploaded Boudhanath GLB has already been integrated and evaluated.

Verified source facts:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- source SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`.

Completed source experiments:

- direct point-cloud rendering;
- deterministic Open3D Poisson surface reconstruction;
- selective source-derived dome/body hybridization.

Decision remains:

**do not replace the Phase 3P.2 hybrid with the point cloud/surface.**

Evidence routes:

- `/?pointcloud=1`
- `/?surface=1`
- `/?selective=1`

Engineering renderer routes:

- `?renderer=spark`
- `?renderer=rad`
- `?renderer=playcanvas`

## Phase 3P.7C outcome

Delivered:

- multi-axis prayer-flag motion;
- reduced-motion-safe decorative behavior;
- eased photographic-environment cross-fade;
- refined fog/exposure/sun/fill balance;
- mobile / balanced / high rendering profiles;
- bounded renderer DPR;
- tier-aware shadow-map and anisotropy settings;
- lightweight smoothed FPS instrumentation;
- browser assertions for quality/DPR/FPS;
- screenshot review on desktop, mobile and reduced-motion modes.

CI's virtualized runner selected:

```text
qualityTier = mobile
rendererDpr = 1.0
sampled FPS ≈ 1.5
```

That FPS value is **not a physical-device benchmark**.

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Current subphase

**Phase 3P.7D — Ambient sound and release readiness**

Status: **not started**

Scope only:

1. optional ambient sound;
2. explicit audio control;
3. no forced audio playback;
4. pause/suppress audio when appropriate;
5. audio licensing/provenance;
6. public-deployment metadata;
7. portfolio screenshots/media;
8. keep monument/source geometry unchanged.

## Next branch

`feat/phase-3p7d-audio-release`

## Guardrails

3P.7D must not:

- change monument/source geometry;
- restart point-cloud/surface experiments;
- change the field-capture NO-GO decision;
- send permission outreach;
- claim the prototype is a scan or digital twin;
- autoplay audible sound without explicit user action.

## Resume rule

1. inspect actual `main` and post-merge CI;
2. repository state wins over documentation if they differ;
3. create 3P.7D only from verified `main`;
4. preserve the current default hybrid;
5. use only clearly licensed/provenance-recorded audio;
6. add deterministic browser proof for audio control/state;
7. keep field-clearance outreach deferred unless the user explicitly changes the decision.
