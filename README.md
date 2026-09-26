# MaybeBoudha

An experimental, browser-based **photorealistic digital heritage experience** centered on Boudhanath Stupa in Kathmandu, Nepal.

The goal is not to make a conventional informational website or a generic 3D model viewer. MaybeBoudha aims to make the visitor feel present at Boudhanath through a high-fidelity reconstructed scene, cinematic presentation, and respectful interactive storytelling.

> Working title: **MaybeBoudha**. Naming and branding can change later without affecting the technical architecture.

## Current status

**Phase 1 — Viewer Foundation: complete**

The repository now contains the smallest working browser viewer foundation needed to begin testing real reconstruction technology:

- Vite + React + TypeScript;
- Three.js + React Three Fiber placeholder renderer;
- injected renderer boundary so the rendering implementation can be replaced;
- orbit / zoom camera controls;
- loading and recoverable failure states;
- reduced-motion awareness;
- renderer error fallback;
- automated component tests;
- reproducible npm lockfile;
- CI test and production-build gates.

The visible geometry is deliberately a placeholder. It is **not** a scan or reconstruction of Boudhanath.

## Product direction

The intended experience combines:

- a photorealistic Boudhanath reconstruction;
- smooth orbit / guided camera movement;
- optional exploratory navigation;
- contextual cultural and architectural hotspots;
- cinematic transitions;
- ambient sound;
- progressive loading and mobile fallbacks;
- an interface that stays secondary to the monument.

The photorealistic layer is expected to come from **Gaussian Splatting, photogrammetry, or another real-scene reconstruction technique**, rather than manually recreating the entire monument as traditional game geometry.

## Core principle

The website and the captured 3D scene must remain decoupled.

The current viewer accepts an injected renderer implementation. A small test reconstruction can therefore replace the placeholder in the next phase without coupling product UI and loading/error behavior to one rendering library.

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

The recoverable scene-loading failure path can be exercised in development with:

```text
?scene=fail
```

## Documentation

- [Product Vision](docs/PRODUCT_VISION.md)
- [Technical Plan](docs/TECHNICAL_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Project State](docs/PROJECT_STATE.md)

## Development rules

1. Work in small, verifiable phases.
2. Do not optimize for visual spectacle before the real rendering pipeline is proven.
3. Preserve a clean boundary between UI, camera logic, content, and the 3D renderer.
4. Test on realistic mobile hardware as well as desktop before production release.
5. Treat cultural accuracy, source licensing, privacy, and capture permissions as product requirements.
6. Avoid committing huge raw reconstruction files directly to Git.
7. Record important technical decisions before large implementation changes.

## Immediate next step

**Phase 2 — Real Reconstruction Renderer Spike**

Use a small, legally usable real reconstruction to compare the leading browser rendering paths. Measure visual quality, loading cost, asset size, memory, camera behavior, and integration complexity before choosing the production renderer or splat format.

See [ROADMAP.md](docs/ROADMAP.md) for the phase boundaries.
