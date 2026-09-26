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
- file size: `18,143,098 bytes`;
- format: SPZ;
- upstream repository license: MIT.

The file is **not copied into this repository**. The spike loads the pinned upstream asset through jsDelivr so large binary data does not enter MaybeBoudha Git history.

This fixture exists only to test the rendering pipeline. It is not Boudhanath content.

## Candidate A — Spark

Version under test:

`Spark 2.2.0`

Why it is first:

- integrates with Three.js;
- supports SPZ directly;
- can coexist with ordinary Three.js scene objects;
- fits behind the existing renderer boundary;
- supports additional splat formats for later experiments.

The spike intentionally loads the release module at runtime rather than adding it to the npm lockfile. This keeps the experiment isolated. If Spark becomes the production choice, it should become a normal pinned project dependency.

### Runtime measurements exposed by the spike

The browser panel records:

- asset download progress when available;
- time from renderer-spike initialization to Spark `onLoad`;
- decoded splat count;
- live rendered FPS.

Memory is **not** reported as a portable JavaScript metric because there is no reliable cross-browser API for GPU memory. Measure it manually with browser/device profiling tools.

## Candidate B — PlayCanvas

PlayCanvas remains the main alternative for large environments because its current Gaussian Splat stack includes:

- WebGL and WebGPU rendering paths;
- GPU sorting on supported WebGPU devices;
- SOG compression;
- Streamed SOG with spatial LOD;
- device-dependent Gaussian budgets.

That architecture may become more attractive when the project reaches a full monument/plaza-sized reconstruction.

Phase 2 should not select PlayCanvas or Spark from feature lists alone. The decision must account for the actual Boudhanath-shaped workload.

## Current comparison

| Dimension | Spark | PlayCanvas |
| --- | --- | --- |
| Existing React/Three integration | Strong | Requires a separate engine integration layer |
| SPZ support for first fixture | Direct | Not the primary production-format direction |
| Hybrid splat + Three scene | Native fit | Possible, but in PlayCanvas scene model |
| Very large streamed environment | RAD / LOD path exists | Streamed SOG is a major strength |
| WebGPU-specific splat path | Not the reason for selection | Strong current capability |
| Phase 2 implementation cost | Lower | Higher |
| Current status | **Running candidate** | **Comparison candidate** |

This table is descriptive, not the final architecture decision.

## Verification plan

### Automated

- TypeScript build;
- Vite production build;
- existing Phase 1 regression tests;
- Spark spike helper tests;
- no binary reconstruction committed to Git.

### Browser/manual

Record separately on at least one desktop and one mobile-class device:

- load time;
- first usable interaction;
- average FPS while orbiting;
- obvious sorting artifacts;
- memory pressure / tab reloads;
- touch orbit and zoom quality;
- retry behavior after network failure.

## Exit criteria

Phase 2 is complete only when:

1. a real Gaussian Splat renders in the MaybeBoudha viewer;
2. measurements are recorded;
3. the credible alternative is compared;
4. renderer + preferred scene format are documented in an architecture decision;
5. the choice is based on evidence rather than ecosystem popularity.

Until those are true, no production Boudhanath capture should begin.
