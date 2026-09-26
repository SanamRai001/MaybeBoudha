# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file ever becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa in Kathmandu, using a real-scene reconstruction pipeline and a web architecture that can progressively serve different device capabilities.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Completed implementation branch: `feat/phase-1-viewer-foundation`
- Pull request: `#1`
- Working title: `MaybeBoudha`

## Completed phase

**Phase 1 — Viewer Foundation**

Status: **complete pending merge of PR #1**

## Changes

- added Vite + React + TypeScript application foundation;
- added Three.js + React Three Fiber placeholder renderer;
- added an injectable scene-renderer boundary;
- added orbit / zoom camera controls through Three.js OrbitControls;
- added loading, renderer-failure, and recoverable scene-load states;
- added `?scene=fail` as an intentional recovery-path check;
- added reduced-motion preference handling;
- added responsive foundation UI with an explicit placeholder disclaimer;
- added Vitest + React Testing Library coverage for loading/failure/retry behavior;
- added Node 24 GitHub Actions CI;
- committed `package-lock.json` generated from the CI environment;
- CI now uses read-only repository permissions and `npm ci`.

## Verification

Verified on the Phase 1 branch:

- automated tests pass: **3/3**;
- `tsc --noEmit` passes as part of the production build;
- Vite production build passes;
- forced preparation failure renders the recovery UI and retry path in tests;
- renderer injection is exercised by tests;
- current CI resolves dependencies from the committed lockfile.

Not yet claimed as verified:

- visual fidelity of a real reconstruction;
- actual Gaussian Splat rendering;
- real-device frame rate or memory;
- cross-browser gesture quality;
- mobile GPU behavior.

Those belong to later phases.

## Decisions

1. React/UI state is kept independent from the concrete 3D renderer.
2. React Three Fiber is the Phase 1 renderer only; it is **not yet the production renderer decision**.
3. The real renderer will be selected from measured Phase 2 results.
4. The current geometry is only a fixture and must not evolve into a manually modeled production Boudhanath.
5. Loading and failure behavior exist before real scene assets are introduced.
6. Dependencies are locked and CI uses `npm ci`.
7. Large reconstruction assets remain outside normal Git history.

## Risks

- obtaining sufficiently complete and legally usable reconstruction input;
- upper-monument coverage from ground-only capture;
- real splat payload size and decoding cost;
- mobile GPU/memory limits;
- renderer/library churn;
- reconstruction artifacts from crowds, flags, lighting, and movement;
- cultural accuracy and respectful presentation.

## Next phase

### Phase 2 — Real Reconstruction Renderer Spike

Goal: prove the rendering approach with a **small legally usable real reconstruction** before touching a production Boudhanath asset.

Only:

- obtain/generate one small test reconstruction;
- integrate the leading renderer candidate behind the existing renderer boundary;
- compare at least the credible rendering paths;
- measure asset size, load behavior, memory, frame rate, camera behavior, mobile behavior, and integration complexity;
- choose and document the production renderer + scene format from evidence.

Do **not** start the production Boudhanath capture, hotspots, audio, or cinematic intro in Phase 2.

## Next branch

Recommended:

`spike/phase-2-reconstruction-renderer`

## Resume rule

1. inspect `main`, PR state, and Git history;
2. verify this checkpoint against the repository;
3. if PR #1 is not merged, finish that before Phase 2;
4. update this file at the end of the next completed phase.
