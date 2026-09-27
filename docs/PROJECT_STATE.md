# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file ever becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa in Kathmandu, using a real-scene reconstruction pipeline and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `spike/phase-2-reconstruction-renderer`
- Pull request: `#2 — spike: Phase 2 real reconstruction renderer`
- Working title: `MaybeBoudha`

## Last completed phase

**Phase 1 — Viewer Foundation**

Merged SHA:

`3a49774bb389dd42352ae5cbc60978e1add743be`

## Current phase

**Phase 2 — Real Reconstruction Renderer Spike**

Status: **complete on feature branch; pending final CI and merge**

## Phase 2 delivered

- real Gaussian Splat rendering;
- Spark 2.2.0 candidate;
- PlayCanvas 2.22.4 candidate;
- renderer switch for direct comparison;
- pinned legal/public test fixtures;
- asset metrics;
- deterministic Chromium/CDP runtime probe;
- screenshot artifacts;
- neutral same-asset compressed-PLY comparison;
- renderer/format ADR.

## Final neutral comparison

Pinned fixture:

- repository: `playcanvas/engine`;
- commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`;
- file: `biker.compressed.ply`;
- payload: ~2.4 MiB;
- decoded splats: **152,746**.

Verified CI run:

`#49`

Results:

- locked install: **passed**;
- tests: **passed**;
- TypeScript/Vite production build: **passed**;
- Spark browser probe: **passed**;
- PlayCanvas browser probe: **passed**;
- Spark reconstruction visibly rendered: **verified**;
- PlayCanvas reconstruction visibly rendered: **verified**;
- Spark hosted-runner load metric: ~**0.19 s**;
- PlayCanvas hosted-runner load metric: ~**0.24 s**.

CI FPS is not a real-device benchmark and is deliberately excluded from the architecture decision.

## Architecture decision

Accepted in:

`docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md`

### Renderer

**Spark 2.2.x**

### Runtime integration

**React product shell + directly managed Three.js/Spark rendering layer**

React Three Fiber remains available where useful but is not required for the production splat runtime.

### Reconstruction interchange

**PLY**

Keep a cleaned/master reconstruction outside ordinary Git history.

### Production web delivery

**Prebuilt paged RAD**

Expected flow:

```text
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

**PlayCanvas**

Reconsider the renderer decision if the real Boudhanath workload exposes a material Spark limitation.

## Important findings

1. A renderer can decode a scene and still render blank when it uses a separate Three.js runtime.
2. Build/test success alone is insufficient for graphics work; CI now includes real browser runtime probes.
3. SPZ generations differed enough across the tested paths that SPZ should not be the project's only master/interchange artifact.
4. Both candidates rendered the same compressed PLY successfully.
5. Raw Three.js made Spark lifecycle/error handling more explicit than the R3F spike path and passed the deterministic browser probe.
6. Large-scene streaming must be tested with a Boudhanath-shaped workload; the small comparison fixture cannot prove production performance.

## Unverified / deferred

We have **not** verified:

- real desktop GPU FPS;
- real phone FPS;
- mobile memory pressure;
- Boudhanath-sized streaming behavior;
- touch quality on physical devices;
- production CDN latency;
- a real Boudhanath capture.

These remain later gates and must not be inferred from hosted CI.

## Known risks

- incomplete upper-monument coverage from ground-only capture;
- capture and drone/elevated-access permissions;
- crowds, moving prayer flags, lighting variation, and occlusion harming reconstruction;
- a full plaza scene being far larger than the test fixture;
- mobile memory limits;
- RAD build/quality settings requiring iteration;
- privacy cleanup for recognizable people/plates;
- cultural/historical content accuracy.

## Next phase

### Phase 3 — Boudhanath Capture / Asset Plan

Only:

- define what physical area the first capture must cover;
- choose the capture/reconstruction toolchain;
- define ground/elevated coverage requirements;
- establish permissions/provenance rules;
- define privacy cleanup;
- produce a small **partial Boudhanath** reconstruction before attempting the full monument/plaza;
- prove PLY → RAD conversion on that partial reconstruction.

Do not begin hotspots, audio, cinematic intro, or first-person navigation.

## Next branch

After PR #2 is merged:

`feat/phase-3-boudhanath-capture-plan`

## Resume rule

1. inspect actual `main` and Git history;
2. read this file and ADR-001;
3. repository state wins over documentation if they differ;
4. update this file at the end of each phase.
