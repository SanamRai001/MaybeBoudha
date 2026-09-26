# Roadmap

The project is deliberately split into small phases. A later phase should not begin until the previous phase has an explicit verification result.

## Phase 0 — Product and architecture foundation

**Goal:** define what is being built before committing to implementation.

### Deliverables

- product vision;
- technical plan;
- phased roadmap;
- canonical project state;
- MVP boundaries;
- initial risks and performance targets.

### Exit criteria

- docs exist on `main`;
- no implementation has been started;
- the next phase is narrow and testable.

**Status: complete.**

---

## Phase 1 — Viewer foundation

**Goal:** create the smallest maintainable browser application that can host a replaceable 3D scene.

### Build

- Vite + React + TypeScript;
- base application shell;
- 3D canvas / renderer boundary;
- camera foundation;
- loading state;
- error fallback;
- reduced-motion awareness;
- one tiny placeholder scene or fixture;
- no Boudhanath production asset.

### Do not build

- final visual design;
- hotspots;
- audio;
- first-person walking;
- large animations;
- production Boudhanath capture.

### Verification

- production TypeScript/Vite build passes;
- loading → renderer lifecycle is covered by automated tests;
- forced scene failure → fallback → retry is covered by automated tests;
- renderer implementation is injectable rather than coupled to product state;
- OrbitControls is attached to the rendered canvas for pointer/touch orbit and zoom;
- dependency resolution is committed in `package-lock.json`;
- real-device gesture quality remains intentionally deferred to later device/browser verification.

**Status: complete.**

---

## Phase 2 — Real reconstruction renderer spike

**Goal:** prove that the chosen browser stack can render a real reconstruction convincingly.

### Build

- obtain or generate one small legal test reconstruction;
- test leading renderer options;
- record measured results;
- select production renderer and asset format;
- document the decision.

### Measure

- scene file size;
- time to first visible scene;
- memory;
- frame rate;
- mobile behavior;
- camera behavior;
- integration complexity.

### Exit criteria

A renderer and asset format are selected from measurements, not assumption.

---

## Phase 3 — Boudhanath capture / asset plan

**Goal:** obtain a legitimate, usable source for the real scene.

### Work

- define capture coverage;
- define ground and elevated coverage needs;
- confirm capture permissions;
- choose reconstruction service/toolchain;
- record provenance and rights;
- make a small partial Boudhanath reconstruction before a full capture.

### Exit criteria

A real Boudhanath asset path is proven and legally usable.

---

## Phase 4 — Production scene integration

**Goal:** make Boudhanath itself the working experience.

### Build

- optimized real scene;
- desktop quality profile;
- mobile quality profile;
- CDN/object-storage delivery;
- progressive loading;
- home camera preset;
- stable orbit / exploration bounds;
- fallback representation.

### Exit criteria

Boudhanath loads reliably on supported desktop and mobile devices with measured performance.

---

## Phase 5 — Cinematic introduction

**Goal:** create the first emotional/presentational layer without compromising control or performance.

### Build

- short initial camera sequence;
- skip control;
- reduced-motion alternative;
- transition into user-controlled mode;
- polished loader / reveal.

### Guardrail

The intro must be short and must never trap the visitor behind animation.

---

## Phase 6 — Cultural exploration

**Goal:** add useful contextual information.

### Build

- 3–5 sourced hotspots;
- guided camera presets;
- content panel system;
- source references;
- optional ambient audio;
- explicit audio controls.

### Guardrail

No gamified scoring, collectibles, or interaction that trivializes religious/cultural meaning.

---

## Phase 7 — Performance, accessibility and resilience

**Goal:** make the experience robust enough for public use.

### Work

- real-device profiling;
- quality auto-selection;
- user quality override;
- slow-network behavior;
- memory-pressure behavior;
- keyboard accessibility;
- touch review;
- reduced motion;
- WebGL/WebGPU failure paths;
- asset-cache/version strategy;
- cross-browser verification.

### Exit criteria

Performance and accessibility are measured and documented.

---

## Phase 8 — Public release

**Goal:** ship a polished, credible portfolio-quality experience.

### Work

- metadata / SEO;
- final branding;
- content review;
- production deployment;
- analytics only if justified;
- privacy review;
- README screenshots/video;
- project write-up;
- deployment verification.

---

## Explicit backlog — not scheduled

These ideas remain outside the committed roadmap until the core experience is successful:

- first-person walk mode;
- day/night switching;
- historic-vs-current comparison;
- narrated guided tours;
- Nepali / Newar / Tibetan or other multilingual content;
- VR/WebXR;
- dynamic NPC/crowd systems;
- multiple heritage sites;
- CMS;
- social/user features.

They should become new phases only after a concrete product reason exists.
