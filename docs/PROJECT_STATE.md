# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa, using a legitimate real-scene reconstruction and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3-boudhanath-capture-plan`
- Working title: `MaybeBoudha`

## Last completed phase

**Phase 2 — Real Reconstruction Renderer Spike**

Status: **complete and merged**

Merge SHA:

`83b56ac01dad2525098c10902baaa2deccd71aa4`

Final merged-main checkpoint before Phase 3:

`23858da663ddefbbb97daed9097f0304fb61ae0e`

Main CI #58 passed:

- locked install;
- tests;
- production build;
- Spark runtime probe;
- PlayCanvas runtime probe.

## Accepted rendering architecture

- renderer: **Spark 2.2.x**;
- integration: **React shell + direct Three.js/Spark renderer**;
- interchange/master direction: **PLY**;
- production delivery: **paged RAD**;
- fallback candidate: **PlayCanvas**.

See `docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md`.

## Current phase

**Phase 3 — Boudhanath Capture / Asset Plan**

### Current subphase

**Phase 3A — Capture governance and field plan**

Status: **implementation complete on branch; verification pending**

## Phase 3A changes

Added:

- `docs/CAPTURE_PLAN.md`;
- `docs/ASSET_PIPELINE.md`;
- `docs/CAPTURE_PROVENANCE_TEMPLATE.md`;
- local capture/output Git exclusions;
- Phase 3A–3D roadmap split.

## Phase 3A decisions

### Capture baseline

**Ground-only by default.**

Drone/elevated aerial capture is not assumed. Current CAAN rules make normal operation over populated areas inappropriate as a casual baseline, and any aerial plan must be separately permitted.

### First real scope

Do **not** scan the whole Stupa first.

Capture one small, ground-accessible, mostly static exterior section with repeatable overlapping paths.

### First reconstruction workflow

```text
phone photos
    ↓
Polycam Gaussian Splat cloud processing
    ↓
source PLY
    ↓
SuperSplat cleanup
    ↓
cleaned master PLY
    ↓
Spark LOD/RAD pipeline
```

Tool/account capabilities must be rechecked immediately before capture because service limits can change.

### Privacy

Raw imagery is private by default.

Public reconstruction requires review of:

- recognizable people;
- children;
- plates;
- screens/documents;
- reflections;
- frozen reconstructed bystanders.

### Asset storage

Real capture data stays outside normal Git history under ignored local working directories or private object storage.

## External/current requirements recorded

Official sources reviewed for Phase 3A include:

- CAAN drone/UAS guidance;
- Nepal Department of Archaeology photography/filming consent information;
- Polycam Gaussian Splat/PLY export documentation;
- SuperSplat cleanup/export documentation;
- Spark RAD/LOD documentation.

The repo plan does not claim that a specific capture date is already authorized.

## Next subphase

### Phase 3B — PLY → RAD processing proof

Before a Boudhanath capture:

1. make a reproducible Spark LOD/RAD build process;
2. run it against a legal small PLY fixture;
3. record builder version/options;
4. load generated RAD with `paged: true`;
5. verify runtime behavior;
6. document output size/chunks/checksums.

Do not begin Phase 3C until Phase 3B is green.

## Blocker for Phase 3C

Physical Boudhanath imagery does not exist in the repository and cannot be invented.

Before field capture, current site/heritage requirements must be reconfirmed for the intended capture method.

## Known risks

- upper monument cannot be captured completely from ground level;
- crowds/flags introduce moving geometry;
- lighting changes harm reconstruction consistency;
- systematic capture may require site/heritage consent;
- aerial capture has separate regulatory requirements;
- cloud reconstruction/export limits can change;
- full-site data may exceed laptop/browser budgets.

## Resume rule

1. inspect branch and CI;
2. read ADR-001, CAPTURE_PLAN, and ASSET_PIPELINE;
3. repository state wins over docs if they differ;
4. continue Phase 3B only after Phase 3A verifies;
5. update this file at every subphase boundary.
