# Technical Plan

## Status

The core web/rendering architecture was validated in Phases 1–2.

Renderer decision:

- **Spark 2.2.x**
- **direct Three.js rendering layer**
- **PLY as reconstruction interchange**
- **paged RAD as planned large-scene browser delivery**

Decision record:

[ADR-001 — Production Renderer and Scene Delivery Format](ADR-001-RENDERER-AND-SCENE-FORMAT.md)

The capture/reconstruction service itself is intentionally not selected until Phase 3.

## System shape

```text
Browser
│
├── React Application Shell
│   ├── loading / fallback UI
│   ├── navigation
│   ├── cultural content
│   └── accessibility controls
│
├── Experience Layer
│   ├── camera intent
│   ├── interaction state
│   ├── hotspots
│   ├── quality policy
│   └── audio controller
│
├── Renderer Adapter
│   └── Three.js + Spark
│       ├── WebGL lifecycle
│       ├── camera
│       ├── conventional mesh overlays
│       ├── SparkRenderer
│       └── streamed SplatMesh
│
└── Asset Delivery
    ├── paged RAD reconstruction
    ├── lightweight fallback
    ├── content media
    └── audio
```

React owns product state and UI. The renderer layer should not force React components to know about Spark internals.

## Web stack

- Vite
- React
- TypeScript
- Three.js
- Spark
- React Three Fiber only where it provides a concrete benefit outside the production splat lifecycle
- lightweight CSS / Tailwind only where useful
- static application deployment
- external object storage/CDN for reconstruction assets

Avoid adding a backend until a real product requirement exists.

## Renderer evidence

Phase 2 implemented Spark and PlayCanvas and finished with a same-asset compressed-PLY browser comparison.

Both candidates:

- reached ready;
- decoded the same 152,746 splats;
- visibly rendered;
- passed locked tests/build;
- produced CI screenshot artifacts.

Hosted CI load metrics were approximately 0.19 s for Spark and 0.24 s for PlayCanvas on the small fixture. The difference is too small/context-specific to be used as the renderer-selection reason.

Spark was chosen primarily for architecture/maintainability plus its LOD/streaming path.

PlayCanvas remains the fallback candidate.

## Reconstruction pipeline

Target:

```text
capture / licensed imagery
        ↓
reconstruction service/tool
        ↓
raw reconstruction
        ↓
cleanup / crop / privacy pass
        ↓
cleaned master PLY
        ↓
quality LOD build
        ↓
paged RAD
        ↓
range-capable object storage/CDN
        ↓
Spark browser runtime
```

The cleaned PLY is the portable reconstruction artifact where the selected reconstruction tool allows it.

The paged RAD is a web delivery artifact, not the only master copy.

## Asset storage

Do not commit raw captures or production reconstruction binaries to normal Git history.

Production storage must support:

- CORS for the application origin;
- HTTP byte-range requests;
- immutable/versioned paths;
- long-lived caching;
- independent scene releases.

Small legal test fixtures may be referenced by pinned upstream URLs for engineering tests.

## Renderer lifecycle

The production Spark path should explicitly own:

- canvas;
- WebGL2 context;
- `THREE.WebGLRenderer`;
- scene;
- camera;
- SparkRenderer;
- SplatMesh;
- animation loop;
- resize observer;
- controls;
- disposal.

Failures during context creation, download, decode, or renderer initialization must surface into the React fallback UI.

## Scene architecture

Stable product concepts:

```ts
SceneAsset
CameraPreset
Hotspot
QualityProfile
ExperienceState
```

Camera/hotspot logic should target renderer-adapter concepts rather than reaching into Spark objects from arbitrary UI components.

## Camera system

Expected modes:

- intro cinematic;
- user orbit;
- guided viewpoint;
- hotspot focus;
- reset/home.

First-person navigation, if ever added, remains a separate mode.

## Quality strategy

### Fallback

- non-3D or lightweight representation;
- essential cultural information remains available.

### Mobile

Begin with Spark's platform-aware LOD budget and a project-level quality scale.

Only create a separate mobile reconstruction when physical-device evidence shows it is necessary.

### Desktop

Allow a larger LOD budget while keeping progressive loading and bounded memory.

## Initial performance targets

These remain provisional until the real partial Boudhanath asset exists.

- application UI should become usable before full reconstruction detail;
- show a meaningful coarse scene as early as possible;
- stable 30 fps minimum on supported mobile hardware during normal interaction;
- 50–60 fps target on typical desktop hardware where practical;
- avoid long main-thread stalls;
- avoid loading the complete high-detail scene into memory when streaming/LOD can prevent it.

Real measurements override targets.

## Accessibility

The 3D scene cannot be the only route to information.

Required:

- keyboard-accessible UI controls;
- visible focus states;
- reduced-motion mode;
- text alternatives for hotspot information;
- explicit audio control;
- no required hover-only interaction;
- useful fallback when 3D is unavailable.

## Privacy and cultural safety

Before publication, reconstruction cleanup must inspect:

- recognizable faces;
- vehicle plates;
- private information;
- incidental screens/signage;
- bystanders;
- reconstruction artifacts that misrepresent sacred/architectural details.

Cultural/historical content requires sourced editorial review separate from rendering code.

## Failure states

Handle explicitly:

- WebGL2 unavailable;
- renderer initialization failure;
- scene metadata/chunk failure;
- interrupted range request;
- decode failure;
- memory pressure;
- unsupported browser/device;
- audio failure.

Never leave the visitor with a black canvas and no explanation.

## Testing

### Unit

- camera state;
- quality selection;
- content validation;
- asset-state decisions;
- fallback rules.

### Integration

- renderer mount/disposal;
- failed scene load;
- camera bridge;
- retry behavior;
- asset-version changes;
- no leaked animation loops or contexts.

### Browser runtime

Keep deterministic smoke coverage that proves the selected renderer reaches ready and produces a real frame.

The Phase 2 PlayCanvas comparison can remain available while the ADR is young, but production CI may later narrow to Spark once Phase 3 validates a real project asset.

### Real-device

Required with the partial/full Boudhanath asset:

- physical desktop;
- physical mobile;
- touch;
- memory pressure;
- slow network;
- LOD transition behavior;
- sorting/visual artifacts.

## Deployment

```text
Static app host
      +
range-capable CDN / object storage
      ↓
versioned paged RAD asset
```

Application deployment and scene deployment should be independently versionable.

## Major risks

| Risk | Mitigation |
| --- | --- |
| Poor Boudhanath source coverage | partial capture proof before full capture |
| Missing upper monument detail | permitted elevated capture or hybrid source plan |
| Huge scene | prebuilt LOD + paged RAD |
| Mobile memory pressure | platform-aware LOD + real-device profiling |
| Renderer regression | adapter boundary + deterministic browser smoke |
| Reconstruction movement artifacts | capture planning + cleanup |
| Licensing/permission uncertainty | provenance log before processing |
| Privacy in captured crowds | explicit cleanup review |
| Cultural misrepresentation | sourced editorial review |
| Scope expansion | protect ROADMAP phase boundaries |

## Before full production scene work

Phase 3 must establish:

1. capture area;
2. capture permissions;
3. capture/reconstruction toolchain;
4. provenance/usage rights;
5. partial Boudhanath reconstruction;
6. cleaned PLY output;
7. PLY → paged RAD conversion;
8. browser proof of that partial asset.
