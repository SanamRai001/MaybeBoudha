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

**Phase 3P.7B — Camera, interaction, mobile and accessibility polish**

Status: **complete and merged**

PR:

`#12 — feat: Phase 3P.7B camera interaction and mobile proof`

Merge SHA:

`942ef9a36554d2bd1f1be06097bc0c4b0e4708a9`

### Final documentation-complete verification

Head:

`aca3a9808d2a5b6a9a10759f8b5533e87fa8c2cf`

Green:

- CI **#226**;
- RAD Pipeline **#126**;
- Surface Reconstruction **#35**.

### Interaction proof

Verified in real Chromium automation:

- Focus view activated by keyboard Enter;
- `aria-pressed` changes correctly on/off;
- Reset view activated by keyboard;
- reset returns camera to `home`;
- cinematic intro yields to user input;
- camera state transitions include `intro`, `explore`, `resetting`, and `home`.

### Mobile proof

Viewport:

`390 × 844`

Verified:

- `scrollWidth = 390`;
- no horizontal overflow;
- Focus control visible;
- Reset control visible;
- real emulated touch drag enters `explore`;
- reset returns to `home`;
- screenshot inspected directly.

### Reduced-motion proof

Verified:

- `prefers-reduced-motion: reduce` is honored;
- camera reaches `home` without cinematic travel;
- UI reports Reduced motion;
- reset is immediate;
- screenshot inspected directly.

Detailed evidence:

`docs/PHASE_3P7B_INTERACTION_MOBILE.md`

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
animated prayer flags
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

Follow-up work already completed:

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

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Current subphase

**Phase 3P.7C — Environment, atmosphere and performance polish**

Status: **not started**

Scope only:

1. improve prayer-flag motion quality;
2. refine photographic-environment blending;
3. refine lighting/fog balance;
4. define device-aware pixel-ratio / quality behavior;
5. add lightweight runtime performance instrumentation;
6. use screenshot evidence for atmosphere decisions;
7. keep monument/source geometry unchanged.

Do not add audio until the visual/performance pass is stable.

## Next branch

`feat/phase-3p7c-atmosphere-performance`

## Resume rule

1. inspect actual `main` and post-merge CI;
2. read this file before changing code;
3. repository state wins over documentation if they differ;
4. start 3P.7C only from verified `main`;
5. use browser/screenshot evidence for visual decisions;
6. do not restart source-geometry experiments without materially better source data;
7. keep field-clearance outreach deferred unless the user explicitly changes the decision.
