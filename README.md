# MaybeBoudha

An experimental browser-based **photorealistic digital heritage experience** centered on Boudhanath Stupa in Kathmandu, Nepal.

The goal is not a normal tourism landing page or a generic 3D viewer. MaybeBoudha aims to make the visitor feel spatially present at Boudhanath through a real-scene reconstruction, calm interaction, and respectful storytelling.

> Working title: **MaybeBoudha**.

## Current status

**Phase 3P.4 — Deterministic Boudhanath surface reconstruction: complete and merged in PR #9. Phase 3P.5 is next.**

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

## Synthetic visual prototype

The default route is now a hybrid Boudhanath visual-feasibility study built before any real field capture.

It combines:

- a user-supplied MiniWorld3D Boudhanath STL, compacted for browser delivery and used for the detailed lower monument;
- a refined procedural harmika / photographic eye façade / thirteen-stage upper spire;
- deterministic plaster weathering;
- prayer wheels and animated prayer flags;
- a public-domain Boudhanath courtyard panorama for the real surrounding shops/temples;
- procedural surroundings only as a photo-load fallback;
- cinematic camera entrance;
- orbit/zoom interaction;
- atmospheric lighting/fog;
- explicit disclosure that the monument is **not scan data**.

This is still a **visual-feasibility study**, not a measured reconstruction or digital twin.

The environment and silhouette are now convincing enough to justify testing a real licensed Boudhanath point cloud, but the monument itself is still visibly synthetic and does **not** yet justify triggering field-clearance outreach.

See [Visual Prototype](docs/VISUAL_PROTOTYPE.md) and [Third-Party Assets](docs/THIRD_PARTY_ASSETS.md).

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
?pointcloud=1         # Phase 3P.3 licensed point-cloud A/B
?surface=1            # Phase 3P.4 deterministic Poisson surface A/B
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
- [Phase 3C Field Readiness](docs/PHASE_3C_FIELD_READINESS.md)
- [Capture Permission Request Template](docs/CAPTURE_PERMISSION_REQUEST_TEMPLATE.md)
- [Visual Prototype](docs/VISUAL_PROTOTYPE.md)
- [Point-Cloud Spike](docs/POINT_CLOUD_SPIKE.md)
- [Surface Reconstruction Spike](docs/SURFACE_RECONSTRUCTION_SPIKE.md)
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

## Licensed point-cloud spike

The uploaded Sketchfab GLB has now been inspected and rendered directly in the browser.

Verified:

- **99,992 points**
- **0 triangles**
- normals present
- ~**3.82 MiB** GLB
- source SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`
- stored point color is uniform gray, not photographic RGB
- direct point rendering works
- normal-based inspection shading works

View the A/B route locally:

```text
/?pointcloud=1
```

The point cloud does **not** replace the current hybrid because its lack of real RGB and visibly sparse point rendering reduce finished visual realism.

See [Point-Cloud Spike](docs/POINT_CLOUD_SPIKE.md).

## Deterministic surface reconstruction

Phase 3P.4 now proves that the licensed point source can be turned into a real triangle surface without generative AI:

- **99,992** oriented source points;
- Open3D **0.20.0** Poisson reconstruction;
- **110,643** output vertices;
- **220,000** output triangles;
- deterministic source/output checksums;
- browser rendering verified after converting Open3D Float64 PLY attributes to GPU-safe Float32 attributes.

The resulting surface is recognizable and useful as geometry, but its monochrome/coarse presentation does **not** beat the current hybrid as the finished experience.

See [Surface Reconstruction Spike](docs/SURFACE_RECONSTRUCTION_SPIKE.md).

## Immediate next step

**Phase 3P.5 — Selective geometry hybridization**

Use only the reconstructed regions that materially improve the existing hybrid while preserving the stronger photographic environment, materials, eye treatment, refined upper monument, and cinematic composition.

Field clearance remains prepared and documented, but intentionally deferred until the strongest legally reusable existing-source path is exhausted.

Do not begin a real systematic Boudhanath photo dataset until Phase 3C.2 is deliberately reactivated and satisfied.

See [ROADMAP.md](docs/ROADMAP.md) for phase boundaries.
