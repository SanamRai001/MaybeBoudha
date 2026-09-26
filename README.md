# MaybeBoudha

An experimental, browser-based **photorealistic digital heritage experience** centered on Boudhanath Stupa in Kathmandu, Nepal.

The goal is not to make a conventional informational website or a generic 3D model viewer. MaybeBoudha aims to make the visitor feel present at Boudhanath through a high-fidelity reconstructed scene, cinematic presentation, and respectful interactive storytelling.

> Working title: **MaybeBoudha**. Naming and branding can change later without affecting the technical architecture.

## Current status

**Phase 0 — Documentation and planning**

There is intentionally no application code yet. The project is being defined before implementation so that the renderer, reconstruction pipeline, content model, and performance strategy can evolve without forcing a rewrite.

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

A placeholder or small test reconstruction should be usable during development. Replacing that asset with the real Boudhanath reconstruction later should not require rewriting the application.

## Documentation

- [Product Vision](docs/PRODUCT_VISION.md)
- [Technical Plan](docs/TECHNICAL_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Project State](docs/PROJECT_STATE.md)

## Development rules

1. Work in small, verifiable phases.
2. Do not optimize for visual spectacle before the real rendering pipeline is proven.
3. Preserve a clean boundary between UI, camera logic, content, and the 3D renderer.
4. Test on realistic mobile hardware as well as desktop.
5. Treat cultural accuracy, source licensing, privacy, and capture permissions as product requirements.
6. Avoid committing huge raw reconstruction files directly to Git.
7. Record important technical decisions before large implementation changes.

## Immediate next step

**Phase 1 — Viewer Foundation**

Build only the smallest application capable of proving:

- the app shell loads;
- a 3D scene can be mounted cleanly;
- camera controls work;
- a replaceable scene asset can be loaded;
- the experience fails gracefully on unsupported or low-performance devices.

See [ROADMAP.md](docs/ROADMAP.md) for the phase boundaries.
