# Phase 2 — Reconstruction Renderer Spike

## Purpose

Phase 2 answered:

> Which browser rendering path should MaybeBoudha use before we invest in a real Boudhanath reconstruction?

The phase compared real Gaussian Splat rendering rather than placeholder geometry.

## Result

**Selected production direction: Spark 2.2.x + raw Three.js integration.**

**Scene pipeline: cleaned/master PLY → prebuilt LOD → paged RAD for web delivery.**

The full decision and reconsideration criteria are recorded in:

[ADR-001 — Production Renderer and Scene Delivery Format](ADR-001-RENDERER-AND-SCENE-FORMAT.md)

## Evidence 1 — Spark viability with a larger SPZ

Early Spark testing used:

- source: `nianticlabs/spz`;
- asset: `samples/hornedlizard.spz`;
- pinned upstream commit: `affd0ecea7fbb4c265ee119475af7ee5b2997482`;
- payload: 17.3 MiB;
- decoded splats: **786,233**.

A real reconstruction was visibly rendered in CI. The recorded hosted-runner load-to-ready metric was approximately **2.57 s**.

### Important integration finding

The first Spark attempt loaded Spark from a remote module while the application used a different Three.js module instance.

It decoded successfully but rendered blank.

Spark was moved to the installed npm dependency so it shares the application's Three.js runtime.

Later, the comparison renderer was made even more explicit by mounting Spark on a directly managed `THREE.WebGLRenderer`. That path exposes context creation, asset initialization, animation-loop ownership, and cleanup directly.

## Evidence 2 — PlayCanvas viability

PlayCanvas 2.22.4 was integrated behind the same product-level renderer boundary.

It successfully loaded and visibly rendered a Gaussian Splat fixture in the automated Chromium probe.

This proved PlayCanvas is a credible fallback, not merely a paper comparison.

## Format compatibility finding

SPZ was not suitable as the final neutral fixture for the exact versions tested because the older and newer SPZ generations were not accepted by both candidates in the same way.

That finding changed the comparison to **compressed PLY**, which both candidates consumed successfully.

It also reinforced the decision to keep a portable source/interchange reconstruction rather than making SPZ the project's only master artifact.

## Final same-asset comparison

The neutral fixture:

- source: `playcanvas/engine`;
- pinned commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`;
- asset: `examples/assets/splats/biker.compressed.ply`;
- payload: 2,487,573 bytes (~2.4 MiB);
- decoded splats: **152,746**.

### CI run #49

Both candidates used the same source reconstruction and passed the deterministic browser probe.

| Evidence | Spark 2.2.0 | PlayCanvas 2.22.4 |
| --- | ---: | ---: |
| Renderer reached ready | yes | yes |
| Reconstruction visibly rendered | yes | yes |
| Decoded splats | 152,746 | 152,746 |
| Hosted-runner load metric | ~0.19 s | ~0.24 s |
| Locked tests/build | pass | pass |

The captured frames visually contain the same reconstructed biker subject in both renderers.

### What these numbers do not prove

The CI environment uses virtualized/software graphics.

Therefore:

- the FPS values shown in the screenshots are **not valid device benchmarks**;
- the small load-time difference is not treated as a meaningful performance win;
- no claim is made about phone memory, battery, or production-scale frame rate.

The CI probe is a **correctness and integration gate**.

## Why Spark was selected

The final decision is not based on the ~0.05 s CI load difference.

Spark was selected because:

1. it works with the existing Three.js architecture;
2. it avoids carrying a second permanent 3D engine;
3. the neutral comparison exposed no correctness disadvantage requiring PlayCanvas;
4. Spark provides prebuilt LOD and paged RAD streaming for large worlds;
5. conventional Three.js objects can share the scene with the reconstruction;
6. the renderer boundary remains replaceable if the real Boudhanath workload proves this decision wrong.

PlayCanvas remains the fallback candidate because its SOG / Streamed-SOG ecosystem is strong for large scenes.

## Production format direction

Do not serve the master PLY directly for the full monument.

Expected flow:

```text
reconstruction
    ↓
cleaned master PLY
    ↓
prebuilt quality LOD
    ↓
paged RAD
    ↓
range-capable CDN / object storage
    ↓
Spark
```

The production RAD settings cannot be chosen until a partial Boudhanath reconstruction exists.

## Runtime verification retained in CI

The Phase 2 branch now verifies:

- locked dependency install;
- automated tests;
- TypeScript/Vite production build;
- real Chromium WebGL/WebGL2 availability;
- Spark reaches ready;
- PlayCanvas reaches ready;
- each candidate produces a runtime screenshot artifact;
- either probe failing fails the runtime-smoke job.

## Real-device validation

Still required later:

- desktop FPS;
- mobile FPS;
- first visible scene;
- memory pressure;
- touch/orbit quality;
- sorting artifacts;
- slow/interrupted delivery;
- LOD transition quality.

Those measurements require a realistic partial or production-sized Boudhanath asset. They remain gates in the production-scene/performance phases and are not fabricated from CI.

## Exit criteria

1. Real Gaussian Splat renders in MaybeBoudha — **met**.
2. Two credible renderer paths were implemented — **met**.
3. Same-asset browser comparison was completed — **met**.
4. Renderer and delivery format were documented in an ADR — **met**.
5. The decision is based on measured integration evidence and product constraints — **met**.

**Phase 2 status: complete, pending PR merge.**
