# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file ever becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa in Kathmandu, using a real-scene reconstruction pipeline and a web architecture that can progressively serve different device capabilities.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `spike/phase-2-reconstruction-renderer`
- Current pull request: `#2 — spike: Phase 2 real reconstruction renderer`
- Working title: `MaybeBoudha`

## Last completed phase

**Phase 1 — Viewer Foundation**

Status: **complete and merged to `main`**

Phase 1 merge SHA:

`3a49774bb389dd42352ae5cbc60978e1add743be`

## Current phase

**Phase 2 — Real Reconstruction Renderer Spike**

Status: **in progress**

### Phase 2A — Spark viability

Status: **implementation and automated browser viability proven**

Implemented:

- pinned `@sparkjsdev/spark 2.2.0`;
- real SPZ reconstruction fixture from `nianticlabs/spz`;
- pinned upstream fixture commit;
- no large scene binary in MaybeBoudha Git history;
- Spark renderer behind the Phase 1 renderer boundary;
- React Three Fiber / Spark shared Three.js runtime;
- asset progress, load time, splat count, and live FPS instrumentation;
- generalized camera controls;
- CI Chromium runtime screenshot artifact;
- committed dependency lockfile.

## Important Phase 2 finding

A remote Spark module initially decoded the asset successfully but rendered a blank canvas.

The cause was the integration shape: Spark and React Three Fiber were using separate Three.js module runtimes.

Switching to the official npm + React Three Fiber integration pattern made the real splat visibly render.

This finding is now treated as an architectural constraint: renderer plugins that depend on Three.js must share the application's Three runtime unless the integration explicitly supports isolation.

## Verification

Latest recorded Spark browser evidence:

- CI run: `#17`;
- headless Chromium runtime smoke: **passed**;
- reconstruction visibly present in screenshot artifact;
- SPZ payload: **18,143,098 bytes / 17.3 MiB**;
- decoded splats: **786,233**;
- load-to-Spark-`onLoad`: approximately **2.57 s** on the hosted CI runner;
- tests: passed;
- TypeScript production check: passed;
- Vite production build: passed.

The CI screenshot's FPS reading is not valid real-device performance evidence and must not be used as a benchmark.

## Decisions

1. React/UI state remains independent from the concrete 3D renderer.
2. Spark is now a viable renderer candidate, **not yet the production winner**.
3. Spark must use the same installed Three.js runtime as React Three Fiber.
4. SPZ is proven as a usable test format for the current object-sized fixture.
5. Large reconstruction assets remain outside normal Git history.
6. CI keeps a browser runtime screenshot because compile/build success alone failed to catch the first graphics integration bug.
7. Renderer selection remains blocked on the credible large-scene alternative and real-device measurements.

## Remaining Phase 2 work

### Phase 2B — PlayCanvas comparison

Only:

- build the smallest credible PlayCanvas Gaussian Splat comparison;
- focus specifically on the large-scene/streaming advantages relevant to a full Boudhanath environment;
- avoid rebuilding the product UI in PlayCanvas;
- record integration complexity and delivery-format differences.

### Phase 2C — Real-device evidence + ADR

After both candidates are understood:

- measure Spark on desktop and mobile-class hardware;
- measure the chosen comparable PlayCanvas scene/path where practical;
- record load time, FPS, touch behavior, memory pressure, and visible artifacts;
- write the renderer/format architecture decision.

## Risks

- an isolated 786k-splat object is much easier than a complete monument/plaza capture;
- GitHub-runner load time is not representative of Nepal/mobile networks;
- headless Chromium is not a valid FPS benchmark;
- SPZ viability does not prove full-environment streaming;
- the final Boudhanath source asset and capture rights remain unresolved;
- upper-monument capture coverage remains a future capture-planning problem.

## Next action

Continue **Phase 2B only** on the current spike branch:

`spike/phase-2-reconstruction-renderer`

Do not begin Boudhanath production capture, hotspots, audio, or the cinematic introduction yet.

## Resume rule

1. inspect PR #2 and current branch state;
2. verify the latest CI result;
3. continue Phase 2B;
4. repository state wins over this file if they differ;
5. update this file again before Phase 2 is closed.
