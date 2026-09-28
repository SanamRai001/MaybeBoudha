# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The strongest existing-source geometry track has reached diminishing returns, so current work is polishing the strongest honest hybrid.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p7b-interaction-mobile`
- Pull request: `#12 — feat: Phase 3P.7B camera interaction and mobile proof`
- Working title: `MaybeBoudha`

## Current milestone

**Phase 3P.7 — Prototype polish and portfolio-ready release**

### Current subphase

**Phase 3P.7B — Camera, interaction, mobile and accessibility polish**

Status: **implementation complete; documentation-complete verification pending**

## Phase 3P.7B delivered

### Camera

- explicit camera state: `intro`, `explore`, `resetting`, `home`;
- cinematic intro yields immediately to pointer/wheel interaction;
- explicit Reset view control;
- animated home reset in standard motion;
- immediate home reset under reduced motion;
- calmer orbit rotate/zoom tuning.

### Keyboard

Deterministic Chromium proof uses real keyboard activation.

Verified:

- Focus view activates with Enter;
- `aria-pressed` becomes `true`;
- Show story restores normal view with Enter;
- Reset view activates from keyboard and returns the camera to `home`.

### Mobile

Dedicated browser proof:

- **390 × 844** viewport;
- mobile emulation enabled;
- touch emulation enabled;
- no horizontal overflow;
- Reset and Focus controls remain visible;
- real emulated touch drag enters `explore`;
- reset returns camera to `home`;
- screenshot inspected directly.

### Reduced motion

Browser emulates `prefers-reduced-motion: reduce`.

Verified:

- media query matches;
- camera reaches `home` without cinematic travel;
- UI reports Reduced motion;
- reset remains immediate;
- screenshot inspected directly.

## Final strengthened implementation verification

Head:

`a24d31c1ac83726ab1bc65d63b8ae9835525c763`

Green:

- CI **#223**;
- RAD Pipeline **#123**;
- Surface Reconstruction **#32**.

CI #223 also preserved:

- uploaded MiniWorld model probe;
- licensed point-cloud probe;
- Spark regression;
- PlayCanvas regression.

Detailed proof:

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

The default remains a **synthetic visual feasibility study**, not scan data or a digital twin.

Engineering evidence routes remain:

- `/?pointcloud=1`
- `/?surface=1`
- `/?selective=1`
- `?renderer=spark`
- `?renderer=rad`
- `?renderer=playcanvas`

## GLB / source status

The uploaded Sketchfab Boudhanath GLB has already been integrated and evaluated.

Verified:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- deterministic point-cloud and Poisson-surface experiments completed.

Decision remains:

**do not replace the current Phase 3P.2 hybrid with the point cloud/surface.**

## Field-clearance state

Phase **3C.2 — Field clearance** remains deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Next subphase after merge

**Phase 3P.7C — Environment, atmosphere and performance polish**

Scope:

1. prayer-flag motion quality;
2. photographic environment blending;
3. lighting/fog balance;
4. pixel-ratio / quality policy;
5. lightweight runtime performance instrumentation;
6. screenshot-driven atmosphere review;
7. keep monument/source geometry unchanged.

Do not add audio until the 3P.7C visual/performance pass is stable.

## Resume rule

1. inspect actual PR #12 head and workflow results;
2. merge only after the documentation-complete SHA is green;
3. post-merge, checkpoint the actual merge SHA on `main`;
4. start 3P.7C only from verified `main`;
5. use screenshot/browser evidence for visual decisions;
6. do not restart source-geometry experiments without materially better source data.
