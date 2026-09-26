# Phase 2 — Reconstruction Renderer Spike

## Purpose

Phase 2 exists to answer one question before the project captures or integrates Boudhanath:

> Which browser rendering path gives us the best practical foundation for a photorealistic reconstruction on desktop and mobile?

This is a technical spike, not final product UI.

## Test reconstruction

The first real Gaussian Splat fixture is:

- source: `nianticlabs/spz`;
- asset: `samples/hornedlizard.spz`;
- pinned upstream commit: `affd0ecea7fbb4c265ee119475af7ee5b2997482`;
- file size: `18,143,098 bytes` (17.3 MiB);
- format: SPZ;
- upstream repository license: MIT.

The file is **not copied into this repository**. The spike loads the pinned upstream asset through jsDelivr so large binary data does not enter MaybeBoudha Git history.

This fixture exists only to test the rendering pipeline. It is not Boudhanath content.

## Candidate A — Spark

Version under test:

`@sparkjsdev/spark 2.2.0`

Why it is first:

- integrates directly with Three.js;
- supports SPZ;
- can coexist with ordinary Three.js scene objects;
- fits behind the existing renderer boundary;
- preserves the current React Three Fiber application architecture.

### Integration decision discovered by the spike

The first experiment loaded Spark as a remote module while React Three Fiber used the app-bundled Three.js runtime.

That configuration decoded all **786,233 splats** and reached a ready state, but the captured canvas remained visually empty.

The integration was replaced with Spark's normal npm dependency and the same declarative React Three Fiber pattern used by Spark's own R3F example. Spark and R3F now share the same Three.js module instance.

After this change, the CI Chromium runtime capture visibly rendered the real Gaussian Splat fixture.

This is exactly why Phase 2 exists: compile-time success was insufficient to prove renderer compatibility.

### Automated runtime evidence

Latest successful Spark runtime smoke evidence before this checkpoint:

- CI run: `#17`;
- browser: headless Chromium;
- asset: 17.3 MiB SPZ;
- decoded splats: **786,233**;
- measured load-to-`onLoad`: approximately **2.57 s** on the GitHub-hosted runner;
- real reconstruction: **visibly rendered in the captured frame**;
- tests: passed;
- TypeScript/Vite production build: passed.

The headless screenshot displayed `FPS 0`. That value is **not accepted as a performance result** because headless CI rendering/throttling is not representative of an interactive device. FPS must be recorded on actual desktop/mobile hardware.

### Runtime measurements exposed by the app

The browser panel records:

- asset download progress when available;
- time from viewer initialization to Spark `onLoad`;
- decoded splat count;
- live rendered FPS.

Memory is **not** reported as a portable JavaScript metric because there is no reliable cross-browser GPU-memory API. It must be inspected using browser/device profiling tools.

## Candidate B — PlayCanvas

PlayCanvas remains the main alternative for a large environment because its Gaussian Splat stack emphasizes:

- WebGL/WebGPU renderer paths;
- large-scene delivery;
- SOG compression;
- streamed SOG / spatial LOD workflows;
- device-aware Gaussian budgets.

Those characteristics may matter more when the workload becomes a complete monument plus surrounding plaza instead of an isolated object.

Phase 2 should not select PlayCanvas or Spark from feature lists alone.

## Current comparison

| Dimension | Spark | PlayCanvas |
| --- | --- | --- |
| Existing React/Three integration | Native fit and now runtime-proven | Requires separate engine integration |
| Current real fixture | 786,233-splat SPZ visibly renders | Pending runtime comparison |
| Hybrid splat + Three scene | Native fit | Uses PlayCanvas scene model |
| Large streamed environment | Requires separate validation | Core comparison reason |
| Production package integration | Pinned npm dependency | Pending spike |
| Phase 2 implementation cost | Lower | Higher |
| Current status | **Viability proven** | **Next comparison** |

This table is descriptive. No production renderer has been selected yet.

## Verification plan

### Automated

- locked dependency install;
- TypeScript build;
- Vite production build;
- Phase 1 regression tests;
- Spark spike helper tests;
- headless Chromium runtime capture;
- no binary reconstruction committed to Git.

### Real-device measurements still required

Record on at least one desktop and one mobile-class device:

- load time;
- first usable interaction;
- average FPS while orbiting;
- obvious sorting artifacts;
- memory pressure / tab reloads;
- touch orbit and zoom quality;
- retry behavior after network failure.

## Exit criteria

Phase 2 is complete only when:

1. a real Gaussian Splat renders in MaybeBoudha — **met for Spark**;
2. measurements are recorded — **partial; CI load evidence exists, real-device data pending**;
3. the credible alternative is compared — **pending PlayCanvas spike**;
4. renderer + preferred scene format are documented in an architecture decision — **pending**;
5. the choice is based on evidence rather than ecosystem popularity — **pending**.

No production Boudhanath capture/integration should begin until those remaining items are resolved.
