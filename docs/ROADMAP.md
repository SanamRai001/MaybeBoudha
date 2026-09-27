# Roadmap

The project is deliberately split into small phases. A later phase should not begin until the previous phase has an explicit verification result.

## Phase 0 — Product and architecture foundation

**Status: complete.**

---

## Phase 1 — Viewer foundation

**Status: complete.**

Delivered the React/TypeScript viewer shell, renderer boundary, camera foundation, fallbacks, tests, and locked CI.

---

## Phase 2 — Real reconstruction renderer spike

**Status: complete and merged.**

Decision:

- production renderer: **Spark**;
- splat runtime: **direct Three.js + Spark**;
- source/interchange reconstruction: **PLY**;
- large web delivery: **paged RAD**;
- PlayCanvas retained as fallback candidate.

See ADR-001 and `RENDERER_SPIKE.md`.

---

## Phase 3 — Boudhanath capture / asset plan

**Goal:** obtain a legitimate, usable source for the real scene and prove the selected reconstruction-to-web pipeline on a partial capture.

### Phase 3A — Capture governance and field plan

Deliver:

- ground-first capture boundary;
- permission/drone guardrails;
- capture technique;
- crowd/privacy handling;
- first cloud reconstruction toolchain;
- cleanup workflow;
- provenance template;
- raw-asset Git exclusions;
- delivery/storage layout.

**Status: in progress.**

### Phase 3B — PLY → RAD processing proof

Use a legal test PLY before touching Boudhanath data.

Deliver:

- reproducible Spark LOD build process;
- quality/paged RAD output;
- recorded builder version/commit;
- output checksums and size;
- Spark `paged: true` browser load;
- automated or repeatable verification.

### Phase 3C — Partial Boudhanath capture

Only after Phase 3A rules are satisfied:

- verify current site/heritage requirements;
- capture one small ground-accessible section;
- keep raw source private;
- reconstruct in the selected cloud workflow;
- export source PLY.

### Phase 3D — Partial asset cleanup and proof

Deliver:

- privacy-reviewed cleaned PLY;
- provenance record;
- PLY → paged RAD;
- browser load through Spark;
- physical desktop/mobile measurements;
- decision on whether full-site capture is viable.

### Phase 3 exit criteria

A legally usable **partial Boudhanath** reconstruction loads through the selected Spark/RAD path with sufficient provenance and device evidence to plan a full capture.

---

## Phase 4 — Production scene integration

**Goal:** make Boudhanath itself the working experience.

Build:

- optimized real scene;
- progressive RAD delivery;
- quality/LOD tuning;
- CDN/object-storage delivery;
- home camera;
- exploration bounds;
- fallback representation;
- real-device performance measurements.

---

## Phase 5 — Cinematic introduction

**Goal:** create the first presentational layer without compromising control or performance.

Build:

- short camera sequence;
- skip;
- reduced-motion path;
- transition to user control;
- polished loader/reveal.

---

## Phase 6 — Cultural exploration

**Goal:** add carefully sourced contextual information.

Build:

- 3–5 sourced hotspots;
- guided camera presets;
- content panels;
- source references;
- optional ambient audio;
- explicit audio controls.

No gamified scoring or interaction that trivializes religious/cultural meaning.

---

## Phase 7 — Performance, accessibility and resilience

Work:

- broader real-device profiling;
- quality auto-selection/override;
- slow-network behavior;
- memory pressure;
- keyboard/touch accessibility;
- reduced motion;
- WebGL failure paths;
- asset caching/versioning;
- cross-browser verification.

---

## Phase 8 — Public release

Work:

- SEO/metadata;
- final branding;
- content review;
- production deployment;
- privacy review;
- README media;
- project write-up;
- deployment verification.

---

## Explicit backlog — not scheduled

- first-person walk mode;
- day/night switching;
- historic-vs-current comparison;
- narrated tours;
- multilingual content;
- VR/WebXR;
- dynamic crowds;
- multiple heritage sites;
- CMS;
- social/user features.
