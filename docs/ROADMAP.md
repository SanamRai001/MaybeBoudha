# Roadmap

The project is deliberately split into small phases. A later phase should not begin until the previous phase has an explicit verification result.

## Phase 0 — Product and architecture foundation

**Goal:** define what is being built before committing to implementation.

**Status: complete.**

---

## Phase 1 — Viewer foundation

**Goal:** create the smallest maintainable browser application that can host a replaceable 3D scene.

Delivered:

- Vite + React + TypeScript;
- application shell;
- renderer boundary;
- camera foundation;
- loading and error fallback;
- reduced-motion awareness;
- placeholder scene;
- tests and locked CI build.

**Status: complete.**

---

## Phase 2 — Real reconstruction renderer spike

**Goal:** prove real Gaussian Splat rendering, compare credible browser paths, and select the production architecture from evidence.

Delivered:

- Spark 2.2.0 spike;
- PlayCanvas 2.22.4 spike;
- real reconstruction fixtures;
- neutral same-asset compressed-PLY comparison;
- deterministic browser runtime probes;
- visual screenshot verification;
- renderer/scene-format ADR.

Decision:

- production renderer: **Spark**;
- splat runtime: **direct Three.js + Spark**;
- source/interchange reconstruction: **PLY**;
- large web delivery: **paged RAD**;
- PlayCanvas retained as fallback candidate.

Real-device performance is intentionally **not claimed** from CI and remains a Phase 4 / Phase 7 production gate with a realistic Boudhanath-sized asset.

**Status: complete and merged.**

---

## Phase 3 — Boudhanath capture / asset plan

**Goal:** obtain a legitimate, usable source for the real scene and prove the selected reconstruction-to-web pipeline on a partial capture.

### Work

- define capture boundary and coverage;
- define ground and elevated coverage needs;
- confirm capture permissions;
- choose capture/reconstruction service/toolchain;
- record provenance and usage rights;
- define privacy cleanup;
- capture or obtain a small partial Boudhanath dataset;
- produce a cleaned partial PLY;
- prove partial PLY → paged RAD → browser delivery.

### Exit criteria

A legally usable partial Boudhanath reconstruction loads through the selected Spark/RAD path and gives enough evidence to plan the full capture.

---

## Phase 4 — Production scene integration

**Goal:** make Boudhanath itself the working experience.

### Build

- optimized real scene;
- progressive RAD delivery;
- quality profiles / LOD tuning;
- CDN/object-storage delivery;
- home camera preset;
- stable exploration bounds;
- fallback representation;
- first real-device desktop/mobile performance measurements.

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

- broader real-device profiling;
- quality auto-selection;
- user quality override;
- slow-network behavior;
- memory-pressure behavior;
- keyboard accessibility;
- touch review;
- reduced motion;
- WebGL failure paths;
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

These become new phases only after a concrete product reason exists.
