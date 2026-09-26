# Project State

This is the canonical checkpoint for continuing MaybeBoudha work.

Update it at the end of every completed phase.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa in Kathmandu, using a real-scene reconstruction pipeline and a web architecture that can progressively serve different device capabilities.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Working title: `MaybeBoudha`

## Current phase

**Phase 0 — Product and architecture foundation**

Status: **complete**

## Completed

- repository created;
- product vision documented;
- MVP and non-goals documented;
- proposed technical architecture documented;
- reconstruction pipeline documented;
- phased roadmap documented;
- project-state checkpoint established.

## Implementation state

There is intentionally **no application implementation yet**.

No framework, renderer, splat library, or capture service should be treated as permanently selected until the planned rendering spike provides measurements.

## Current decisions

1. The core product is a photorealistic interactive heritage experience, not a generic 3D viewer.
2. Real-scene reconstruction is preferred over manually modeling the complete Stupa.
3. Scene assets must be replaceable independently from application/UI logic.
4. Large raw captures and production reconstruction binaries should stay outside normal Git history.
5. The real renderer choice will be validated with a small reconstruction before production Boudhanath integration.
6. Desktop and mobile may use different scene quality assets.
7. Essential information must remain accessible when 3D rendering fails.
8. Cultural content and capture provenance are first-class product concerns.

## Proposed — not yet locked

- Vite;
- React;
- TypeScript;
- Three.js / React Three Fiber for the first viewer spike;
- a Gaussian Splat-capable renderer;
- static application hosting plus CDN/object storage for large scene assets.

## Verification

Phase 0 is documentation-only, so verification consists of:

- repository contains the documented foundation;
- roadmap has explicit phase boundaries;
- implementation has not started;
- renderer choice remains intentionally open pending measurement.

No runtime/build/test verification exists yet because there is no application code.

## Known risks

- obtaining sufficiently complete Boudhanath capture coverage;
- permission/licensing for capture and source imagery;
- incomplete upper geometry from ground-only capture;
- browser asset size and decoding cost;
- mobile GPU/memory limitations;
- renderer/library churn;
- reconstruction artifacts caused by crowds, flags, lighting, and movement;
- cultural accuracy and respectful presentation.

## Next phase

### Phase 1 — Viewer Foundation

Only:

- scaffold Vite + React + TypeScript;
- define the renderer boundary;
- mount a tiny placeholder scene;
- implement base camera controls;
- add loading/error states;
- add reduced-motion awareness;
- verify development and production builds;
- verify a forced asset-failure path.

Do **not** begin Phase 2, Boudhanath capture, hotspots, audio, or final visual design during Phase 1.

## Next branch

Recommended:

`feat/phase-1-viewer-foundation`

## Resume rule

When work resumes:

1. read this file;
2. inspect the actual repository and Git history;
3. treat repository state as authoritative if it differs from this document;
4. update this file when the phase ends.
