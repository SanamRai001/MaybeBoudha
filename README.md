# MaybeBoudha

An experimental browser-based **photorealistic digital heritage experience** centered on Boudhanath Stupa in Kathmandu, Nepal.

The goal is not a normal tourism landing page or a generic 3D viewer. MaybeBoudha aims to make the visitor feel spatially present at Boudhanath through a real-scene reconstruction, calm interaction, and respectful storytelling.

> Working title: **MaybeBoudha**.

## Current status

**Phase 3 — Boudhanath Capture / Asset Plan: in progress (Phase 3A).**

The project has moved beyond placeholder geometry. Two real Gaussian Splat renderer paths were implemented and browser-tested:

- Spark 2.2.0;
- PlayCanvas 2.22.4.

The final neutral test used the same compressed PLY in both renderers:

- 2.4 MiB;
- 152,746 splats;
- both reached ready;
- both visibly rendered in deterministic Chromium captures;
- locked tests and production build passed.

CI FPS is not treated as a device benchmark.

## Selected architecture

The accepted production direction is:

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
CDN / object storage
        ↓
browser
```

PlayCanvas remains the fallback renderer candidate if the real Boudhanath workload exposes a material limitation in Spark.

See [ADR-001](docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md).

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

Renderer comparison:

```text
?renderer=spark
?renderer=playcanvas
```

The Phase 1 recoverable preparation failure path remains available with:

```text
?scene=fail
```

## Documentation

- [Product Vision](docs/PRODUCT_VISION.md)
- [Technical Plan](docs/TECHNICAL_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Renderer Spike](docs/RENDERER_SPIKE.md)
- [ADR-001 — Renderer and Scene Format](docs/ADR-001-RENDERER-AND-SCENE-FORMAT.md)
- [Capture Plan](docs/CAPTURE_PLAN.md)
- [Asset Pipeline](docs/ASSET_PIPELINE.md)
- [Capture Provenance Template](docs/CAPTURE_PROVENANCE_TEMPLATE.md)
- [Project State](docs/PROJECT_STATE.md)

## Development rules

1. Work in small, verifiable phases.
2. Do not optimize visual effects before reconstruction quality.
3. Keep UI, camera intent, cultural content, and renderer concerns separate.
4. Test on physical mobile/desktop hardware before production claims.
5. Treat cultural accuracy, source licensing, privacy, and capture permissions as product requirements.
6. Keep raw/large reconstruction files outside ordinary Git.
7. Record architecture changes in an ADR when they materially alter the production path.

## Immediate next step

**Phase 3 — Boudhanath Capture / Asset Plan**

The next goal is not UI polish. It is to obtain a small, legitimate **partial Boudhanath reconstruction**, clean it to PLY, convert it to paged RAD, and prove the selected pipeline before attempting the entire monument/plaza.

See [ROADMAP.md](docs/ROADMAP.md) for phase boundaries.
