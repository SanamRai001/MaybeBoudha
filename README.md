# MaybeBoudha

An experimental browser-based **photorealistic digital heritage experience** centered on Boudhanath Stupa in Kathmandu, Nepal.

The goal is not a normal tourism landing page or a generic 3D viewer. MaybeBoudha aims to make the visitor feel spatially present at Boudhanath through a real-scene reconstruction, calm interaction, and respectful storytelling.

> Working title: **MaybeBoudha**.

## Current status

**Phase 3 — Boudhanath Capture / Asset Plan: Phase 3B engineering proof is green; final PR verification is pending.**

The project now has verified browser evidence for both the renderer choice and the selected large-scene delivery path:

- Spark 2.2.0 is the production renderer direction;
- PlayCanvas 2.22.4 remains the fallback candidate;
- a pinned compressed PLY was converted with Spark's pinned Rust builder;
- quality LOD + chunked RAD was generated successfully;
- HTTP byte-range delivery was verified;
- the generated RAD visibly rendered through Spark with `paged: true`.

CI FPS and hosted-runner timing are not treated as physical-device benchmarks.

## Selected architecture

```text
React product shell
        ↓
direct Three.js renderer
        ↓
Spark
        ↓
paged RAD / LOD scene
```

Asset pipeline:

```text
capture / licensed imagery
        ↓
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
browser
```

PlayCanvas remains the fallback renderer candidate if the real Boudhanath workload exposes a material limitation in Spark.

See [ADR-001](docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md).

## Phase 3B proof

The pinned engineering fixture produced:

- source PLY: **2,487,573 bytes**, **152,746 splats**;
- quality LOD: **202,475 splats**;
- chunked RAD: **4 RADC chunks + 1 RAD header**;
- total RAD delivery: **4,033,648 bytes**;
- range request: **206 Partial Content**;
- generated paged RAD: **visibly rendered in Chromium**.

The Spark source is pinned to commit:

`4eb719afdb5b3655fe0bc290588e4728d9772405`

The practical pinned Rust toolchain for that exact lockfile is **1.88.0**.

The build process is pinned and repeatable, but Spark embeds per-run timing metadata in the small RAD header, so the header hash is not expected to be bit-for-bit identical across rebuilds. Each build manifest records the exact artifact hashes.

See [Phase 3B RAD Pipeline Proof](docs/RAD_PIPELINE_PROOF.md).

## Product direction

The intended experience combines:

- a photorealistic Boudhanath reconstruction;
- smooth orbit / guided camera movement;
- optional exploratory navigation;
- contextual cultural and architectural hotspots;
- cinematic transitions;
- ambient sound;
- progressive loading and mobile quality control;
- an interface that stays secondary to the monument.

## Core principle

The product shell and captured 3D scene remain decoupled.

Large raw captures and production reconstruction binaries do not belong in ordinary Git history.

## Local development

Requires Node.js 24 or newer.

```bash
npm ci
npm run dev
```

Verification:

```bash
npm test
npm run build
```

Technical renderer/delivery modes:

```text
?renderer=spark       # pinned compressed PLY through Spark
?renderer=rad         # generated paged RAD proof
?renderer=playcanvas  # Phase 2 fallback comparison
```

The Phase 1 recoverable preparation failure path remains available with:

```text
?scene=fail
```

The `?renderer=rad` route expects generated RAD/RADC files under `/rad/`; normal local development does not build those assets automatically.

## Documentation

- [Product Vision](docs/PRODUCT_VISION.md)
- [Technical Plan](docs/TECHNICAL_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Renderer Spike](docs/RENDERER_SPIKE.md)
- [ADR-001 — Renderer and Scene Format](docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md)
- [Capture Plan](docs/CAPTURE_PLAN.md)
- [Asset Pipeline](docs/ASSET_PIPELINE.md)
- [Phase 3B RAD Pipeline Proof](docs/RAD_PIPELINE_PROOF.md)
- [Capture Provenance Template](docs/CAPTURE_PROVENANCE_TEMPLATE.md)
- [Project State](docs/PROJECT_STATE.md)

## Development rules

1. Work in small, verifiable phases.
2. Do not optimize visual effects before reconstruction quality.
3. Keep UI, camera intent, cultural content, and renderer concerns separate.
4. Test on physical mobile/desktop hardware before production claims.
5. Treat cultural accuracy, source licensing, privacy, and capture permissions as product requirements.
6. Keep raw/large reconstruction files outside ordinary Git.
7. Keep reconstruction processing separate from ordinary web-app builds.
8. Record architecture changes in an ADR when they materially alter the production path.

## Immediate next step

Finish the final Phase 3B branch verification and merge PR #4.

After that, **Phase 3C — Partial Boudhanath Capture** may begin only after current site/heritage requirements for the intended systematic capture are reconfirmed.

See [ROADMAP.md](docs/ROADMAP.md) for phase boundaries.
