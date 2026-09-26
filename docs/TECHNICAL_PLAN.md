# Technical Plan

## Status

This document records the **proposed architecture**, not final implementation choices.

The most important unresolved decision is the production 3D / Gaussian Splat renderer. That decision should be made after a small browser spike using a real reconstruction asset.

## System shape

```text
Browser
│
├── Application Shell
│   ├── loading / fallback UI
│   ├── navigation
│   ├── content panels
│   └── accessibility controls
│
├── Experience Layer
│   ├── camera director
│   ├── interaction state
│   ├── hotspots
│   ├── quality selection
│   └── audio controller
│
├── Renderer Adapter
│   ├── scene lifecycle
│   ├── asset loader
│   ├── camera bridge
│   └── capability detection
│
└── Assets
    ├── reconstructed scene
    ├── lightweight fallback
    ├── content media
    └── audio
```

The renderer adapter is deliberate. UI and product logic should not know whether the underlying scene is rendered by Spark/Three.js, PlayCanvas, or another renderer.

## Proposed web stack

Initial application direction:

- **Vite**
- **React**
- **TypeScript**
- **Three.js ecosystem** for the first rendering spike
- **React Three Fiber** if it simplifies lifecycle and composition without hiding important performance behavior
- lightweight CSS / Tailwind only where useful for UI
- static deployment through a CDN-capable host

Avoid adding a backend until a real requirement exists.

## Renderer decision

### Candidate A — Three.js / React Three Fiber + Gaussian Splat renderer

Advantages:

- fits the React application model;
- strong control over custom UI and camera composition;
- easy integration with traditional Three.js geometry;
- good fit for hybrid scenes.

Risks:

- splat libraries can evolve quickly;
- React abstraction can obscure performance hot paths if used carelessly;
- asset streaming / LOD behavior must be verified with production-sized scenes.

### Candidate B — PlayCanvas

Advantages:

- strong real-time scene tooling;
- Gaussian Splat support is a first-class use case;
- good path for larger interactive scenes and browser delivery.

Risks:

- different authoring/runtime model from the rest of the React stack;
- tighter integration work may be needed for custom React UI.

### Decision rule

Do **not** select the production renderer from documentation alone.

Phase 2 should test the same small real reconstruction in the leading candidates and compare:

- visual quality;
- load time;
- compressed asset size;
- memory use;
- mobile behavior;
- camera control;
- progressive loading;
- integration complexity;
- failure handling;
- maintainability.

The result should be recorded as an architecture decision before full Boudhanath integration.

## Reconstruction pipeline

The target pipeline is:

```text
Capture / licensed imagery
        ↓
Cloud or workstation reconstruction
        ↓
Gaussian Splat / photogrammetry output
        ↓
Crop + remove noise + privacy cleanup
        ↓
Optimize / compress
        ↓
Generate desktop + mobile representations
        ↓
Upload to object storage / CDN
        ↓
Load progressively in browser
```

### Source data

Preferred order:

1. imagery captured specifically for this project with appropriate permission;
2. imagery supplied with explicit rights for reconstruction;
3. an existing reconstruction with a compatible license.

Do not scrape arbitrary photos from the web and treat them as production capture data.

### Repository storage

Raw captures and large reconstruction outputs should **not** live in normal Git history.

Use:

- object storage / CDN for production assets;
- a documented local asset path for development;
- small test fixtures only in Git;
- Git LFS only if there is a specific reason and the storage implications are understood.

## Scene architecture

The scene should expose stable concepts:

```ts
SceneAsset
CameraPreset
Hotspot
QualityProfile
ExperienceState
```

Exact TypeScript interfaces belong in implementation, but the conceptual separation should remain.

The app must be able to replace:

```text
placeholder.scene
        ↓
small-test.splat
        ↓
boudha-preview
        ↓
boudha-production
```

without rewriting camera, hotspot, or UI code.

## Camera system

Separate camera intent from raw renderer APIs.

Expected modes:

- intro cinematic;
- user orbit;
- guided viewpoint transition;
- hotspot focus;
- reset / home.

Later first-person navigation, if added, should be a separate mode rather than mixed into orbit logic.

## Quality profiles

Start with three conceptual tiers:

### Fallback

- static or lightweight representation;
- usable when 3D is unsupported or fails.

### Mobile

- reduced splat count / resolution;
- conservative memory use;
- limited expensive effects.

### Desktop

- higher-quality scene;
- richer post-processing only when measured safe.

Quality selection must be overridable rather than silently assuming device class is always correct.

## Initial performance targets

These are engineering targets and can be revised after real measurements.

- UI should become usable before the full 3D asset finishes loading.
- Never require the highest-quality asset before showing meaningful content.
- Target a first 3D preview payload around **10 MB or less** where the format permits.
- Keep the main mobile scene target around **30 MB or less** if visual quality remains acceptable.
- Treat desktop high-fidelity assets above roughly **80 MB** as a signal that streaming / stronger LOD is required.
- Aim for a stable **30 fps minimum** on supported mobile devices during normal interaction.
- Aim for **50–60 fps** on typical desktop hardware where practical.
- Avoid long main-thread stalls during decoding or scene transitions.

Real measurements take precedence over these provisional budgets.

## Accessibility

The 3D scene cannot be the only way to access information.

Required direction:

- keyboard-accessible UI controls;
- visible focus states;
- reduced-motion mode;
- text alternatives for hotspot content;
- explicit audio mute / play control;
- no required hover-only interaction;
- non-3D fallback for essential informational content.

## Audio

Audio must not autoplay with sound without user intent.

Architecture should support:

- ambient loop;
- mute;
- volume;
- route / visibility pause;
- future guided narration.

Audio is enhancement, not a loading dependency.

## Privacy and cultural safety

Capture cleanup must inspect:

- recognizable faces;
- vehicle plates;
- private information;
- incidental screens / signs;
- bystanders who should not be immortalized in the reconstruction.

Cultural/historical copy needs sources and should be reviewed separately from code.

## Browser capability failure

Failure states are product states.

Examples:

- WebGL/WebGPU unavailable;
- renderer initialization fails;
- reconstruction fails to download;
- asset exceeds device memory;
- decoding fails;
- audio unavailable.

The visitor should receive a useful fallback, not a black canvas.

## Testing direction

### Unit

- camera state transitions;
- quality selection;
- hotspot state;
- content validation;
- fallback decisions.

### Integration

- renderer mounts and disposes cleanly;
- failed asset loading produces fallback UI;
- camera presets target expected scene coordinates;
- route / state transitions do not leak rendering resources.

### E2E

- desktop first visit;
- mobile viewport;
- reduced motion;
- failed 3D asset;
- slow network;
- revisit / cached asset;
- keyboard navigation.

### Performance

Measure with real production assets before calling the experience complete.

## Deployment direction

Prefer a static web deployment plus external asset storage/CDN.

```text
Static app host
      +
CDN / object storage
      ↓
versioned scene assets
```

This keeps large binary assets independent of application deploys and permits cache-friendly scene versioning.

## Major risks

| Risk | Mitigation |
| --- | --- |
| No sufficiently good Boudhanath capture | Prove pipeline on a small scene before building around the monument |
| Upper monument geometry is missing from ground capture | Plan elevated/legal capture or hybrid reconstruction |
| Asset too large for web | compression, LOD, progressive loading, separate mobile asset |
| Mobile GPU/memory pressure | real-device profiling and explicit quality tiers |
| Renderer/library churn | renderer adapter and early technical spike |
| Visual artifacts from moving people/flags | capture planning and cleanup |
| Licensing / permission uncertainty | provenance log before production use |
| Sacred/cultural content presented poorly | source content and keep editorial review separate |
| Scope expands into a game | protect MVP boundaries in ROADMAP.md |

## Architecture decision checkpoints

Before Phase 3 begins, record at least:

1. chosen renderer;
2. chosen scene asset format;
3. asset hosting strategy;
4. initial mobile quality strategy;
5. reconstruction toolchain;
6. licensing/provenance of the real capture.
