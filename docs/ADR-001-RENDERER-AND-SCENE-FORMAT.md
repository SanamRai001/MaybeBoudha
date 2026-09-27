# ADR-001 — Production Renderer and Scene Delivery Format

- Status: **Accepted**
- Phase: **2 — Real Reconstruction Renderer Spike**
- Decision date: **2026-09-27**

## Context

MaybeBoudha needs to render a photorealistic reconstruction of Boudhanath in a browser while preserving:

- a React product shell;
- cinematic camera control;
- future hotspots and conventional 3D overlays;
- progressive loading;
- bounded mobile memory;
- a path to monument/plaza-scale Gaussian Splat scenes.

The production choice could not be made from library feature lists alone, so Phase 2 implemented and browser-tested Spark and PlayCanvas.

## Evidence

### Early Spark proof

Spark 2.2.0 rendered the Niantic horned-lizard SPZ test fixture:

- payload: 17.3 MiB;
- decoded splats: 786,233;
- visually confirmed in CI capture;
- approximately 2.57 s to Spark load completion on that hosted runner.

This also exposed an integration bug: loading Spark from a separate remote Three.js runtime could decode successfully while rendering a blank canvas. Spark must share the application's Three.js runtime.

### Neutral same-asset comparison

The final fair comparison used the same pinned PlayCanvas biker **compressed PLY** fixture in both engines:

- source repository: `playcanvas/engine`;
- pinned commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`;
- payload: 2,487,573 bytes (~2.4 MiB);
- decoded splats: 152,746.

CI run **#49** verified on the same branch revision:

| Evidence | Spark 2.2.0 | PlayCanvas 2.22.4 |
| --- | ---: | ---: |
| Renderer reached ready | yes | yes |
| Reconstruction visibly rendered | yes | yes |
| Decoded splats | 152,746 | 152,746 |
| Hosted-runner load metric | ~0.19 s | ~0.24 s |
| Locked tests/build | pass | pass |

The displayed CI FPS values are **not performance benchmarks**. The runner uses software/virtualized graphics and is suitable for correctness evidence only.

## Format findings

SPZ was not suitable as the neutral comparison format for the exact versions tested:

- the older Niantic SPZ fixture was compatible with Spark;
- the current PlayCanvas SPZ path expected the newer SPZ generation used by its current examples.

That compatibility mismatch is a reason not to make SPZ the canonical project interchange format.

Both engines successfully consumed the compressed PLY fixture.

## Decision

### 1. Production renderer: Spark 2.2.x

Use Spark as the primary Gaussian Splat renderer.

Why:

- it integrates directly with the existing Three.js architecture;
- it avoids introducing a second permanent 3D engine into the product;
- the neutral browser comparison showed no correctness or loading disadvantage that justifies the extra engine boundary;
- Spark has a large-scene path through prebuilt LOD trees and paged RAD streaming;
- conventional Three.js geometry can coexist with the splat scene for later hotspots, collision proxies, annotations, and visual effects.

PlayCanvas remains a documented fallback candidate if the real Boudhanath workload exposes a limitation that cannot be solved acceptably in Spark.

### 2. Spark integration: raw Three.js renderer boundary

The production splat layer should use a directly managed `THREE.WebGLRenderer` + Spark runtime rather than requiring React Three Fiber for Spark itself.

React remains the application/UI architecture.

Reasons:

- the raw Three.js path is small and explicit;
- it passed the deterministic browser smoke test;
- renderer lifecycle, context failure, asset initialization, and disposal remain visible rather than hidden behind another abstraction;
- React Three Fiber can still be used elsewhere if it has a concrete benefit.

### 3. Reconstruction interchange format: PLY

Keep an authoritative cleaned reconstruction in a broadly supported PLY representation where the reconstruction/export pipeline permits.

Do not treat the browser delivery artifact as the only master copy.

Benefits:

- portable between tooling;
- usable by both evaluated renderers;
- can be converted into renderer-specific optimized delivery formats;
- avoids locking the capture pipeline to one browser renderer.

Raw/cleaned source assets remain outside normal Git history.

### 4. Production web delivery: prebuilt paged RAD

For a full Boudhanath environment, do not ship one huge PLY.

Generate a prebuilt Spark LOD tree and deliver it as paged/streamable RAD.

Expected production pipeline:

```text
capture imagery
    ↓
reconstruction
    ↓
cleaned master PLY
    ↓
Spark build-lod / quality LOD generation
    ↓
paged RAD
    ↓
object storage / CDN with byte-range support
    ↓
Spark SplatMesh({ paged: true })
```

The exact build settings must be measured with the real Boudhanath reconstruction.

## Hosting implication

Production scene storage must support:

- cross-origin access from the web app;
- HTTP byte-range requests;
- long-lived immutable caching for versioned scene chunks;
- replacing scene versions independently from application deployments.

Do not store production reconstruction binaries in ordinary Git history.

## Mobile strategy

Start with Spark's platform-aware LOD budget rather than maintaining a completely separate handcrafted mobile scene.

Expose a project-level quality multiplier so the budget can be reduced after real-device profiling.

A separate mobile reconstruction should only be introduced if measured device memory/load behavior requires it.

## Consequences

### Positive

- one primary 3D engine;
- React remains focused on product UI;
- direct access to Three.js for hybrid scene elements;
- large-scene streaming path exists before Boudhanath capture starts;
- source reconstruction remains portable.

### Costs

- RAD becomes a Spark-specific web delivery artifact;
- the project must maintain a conversion/build step from the master reconstruction;
- PlayCanvas's SOG/Streamed-SOG ecosystem is not used by default;
- real mobile/desktop performance remains unverified until a realistic Boudhanath-sized asset exists.

## Reconsider this ADR if

Re-open the decision if any of these occur:

1. the partial Boudhanath reconstruction cannot meet first-visible-scene or memory targets with paged RAD;
2. Spark has unacceptable visual sorting/artifact behavior on the monument;
3. mobile devices fail the agreed quality floor despite LOD tuning;
4. PlayCanvas demonstrates materially better results on the **same Boudhanath source reconstruction**;
5. Spark maintenance or browser compatibility becomes a production risk.

## Validation still required

This ADR selects an architecture; it does **not** claim production performance.

Real-device validation remains required with the actual/partial Boudhanath asset for:

- desktop FPS;
- mobile FPS;
- GPU/total memory pressure;
- first visible scene;
- progressive-detail behavior;
- touch interaction;
- visual artifacts while orbiting;
- recovery from interrupted/slow asset delivery.
