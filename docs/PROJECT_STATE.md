# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file ever becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa in Kathmandu, using a real-scene reconstruction pipeline and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed phase

**Phase 2 — Real Reconstruction Renderer Spike**

Status: **complete and merged**

PR:

`#2 — spike: Phase 2 real reconstruction renderer`

Merge SHA:

`83b56ac01dad2525098c10902baaa2deccd71aa4`

Final pre-merge CI:

`#53 — fully green`

That exact PR head passed:

- locked dependency install;
- automated tests;
- TypeScript/Vite production build;
- Spark runtime probe;
- PlayCanvas runtime probe;
- screenshot artifact generation;
- final dual-renderer gate.

## Phase 2 evidence

Neutral comparison fixture:

- source: `playcanvas/engine`;
- commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`;
- file: `biker.compressed.ply`;
- payload: ~2.4 MiB;
- decoded splats: **152,746**.

Both Spark 2.2.0 and PlayCanvas 2.22.4:

- reached ready;
- decoded the same splat count;
- visibly rendered the reconstruction;
- completed deterministic Chromium/CDP probes.

Recorded hosted-runner load metrics on the neutral run:

- Spark: ~**0.19 s**;
- PlayCanvas: ~**0.24 s**.

Those values are correctness/integration evidence only. CI FPS and software-rendered timing are not real-device performance claims.

## Accepted architecture

Decision record:

`docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md`

### Renderer

**Spark 2.2.x**

### Runtime integration

**React product shell + directly managed Three.js/Spark rendering layer**

### Reconstruction interchange

**PLY**

### Production web delivery

**Prebuilt paged RAD**

Expected flow:

```text
capture / licensed imagery
        ↓
reconstruction
        ↓
cleaned master PLY
        ↓
quality LOD build
        ↓
paged RAD
        ↓
range-capable CDN/object storage
        ↓
Spark
```

### Fallback renderer

**PlayCanvas**, if the real Boudhanath workload exposes a material Spark limitation.

## Important findings

1. Build success alone is insufficient for graphics work; runtime browser evidence is required.
2. A separate Three.js runtime can decode a splat yet render incorrectly.
3. SPZ generation/version compatibility differed across the evaluated paths; it is not the sole project master format.
4. Both candidate renderers successfully consumed the same compressed PLY.
5. Direct Three.js gives the Spark runtime explicit control over context creation, initialization, animation loop, resize, and disposal.
6. The small benchmark cannot prove monument/plaza-scale performance.

## Still unverified

Do not claim these are solved yet:

- real desktop GPU FPS;
- real phone FPS;
- mobile memory pressure;
- full Boudhanath streaming;
- physical touch quality;
- production CDN latency;
- capture completeness;
- reconstruction quality of the actual Stupa.

These become measurable once a partial real Boudhanath asset exists.

## Current phase

**Phase 3 — Boudhanath Capture / Asset Plan**

Status: **not started**

## Phase 3 scope

Only:

- define the first physical capture boundary;
- choose the capture/reconstruction toolchain;
- define ground/elevated coverage;
- establish permission/provenance rules;
- define privacy cleanup;
- obtain/capture a small partial Boudhanath dataset;
- create a cleaned partial PLY;
- prove partial PLY → paged RAD → Spark browser delivery.

Do not begin hotspots, audio, cinematic intro, or first-person navigation.

## Next branch

`feat/phase-3-boudhanath-capture-plan`

## Known risks

- upper-monument coverage from ground-only imagery;
- aerial/elevated capture permissions;
- moving crowds and prayer flags;
- changing light/exposure;
- occlusion from nearby buildings and people;
- privacy cleanup;
- cultural/architectural accuracy;
- a full plaza capture exceeding practical browser/device budgets.

## Resume rule

1. inspect actual `main` and Git history;
2. read this file and ADR-001;
3. repository state wins over documentation if they differ;
4. create the Phase 3 branch from verified `main`;
5. update this file at the end of the phase.
