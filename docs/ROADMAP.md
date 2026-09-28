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

## Phase 3P — Synthetic visual feasibility

**Goal:** prove the visual/product direction before spending effort on real-world capture clearance and source acquisition.

This phase runs as a deliberate product-validation track alongside the prepared Phase 3C clearance path.

### Phase 3P.1 — Composition baseline

**Status: complete on PR #6.**

Delivered:

- full-screen synthetic Boudhanath experience;
- procedural monument at approximate real-world scale;
- dome / harmika / eyes / thirteen-tier spire;
- prayer wheels and animated flags;
- courtyard and surrounding façades;
- cinematic camera entrance;
- orbit / zoom;
- reduced motion;
- responsive editorial overlay;
- explicit synthetic/no-scan disclosure;
- default-route Chromium screenshot gate;
- existing Spark/PlayCanvas/RAD regressions preserved.

Verdict:

- strong enough to continue synthetic visual development;
- still visibly synthetic;
- **not yet sufficient to trigger field-clearance work**.

See `VISUAL_PROTOTYPE.md`.

### Phase 3P.2 — Realism and material pass

**Status: complete and merged in PR #6.**

Delivered:

- compact browser import of the user-supplied MiniWorld3D Boudhanath STL;
- hybrid geometry: imported lower monument + refined procedural upper monument;
- licensed photographic eye treatment;
- deterministic imported-plaster weathering;
- sloped thirteen-stage spire tiers;
- public-domain photographic Boudhanath courtyard environment;
- procedural environment fallback;
- tighter human-scale camera framing;
- contact shadow / environment blending;
- repeated Chromium screenshot review;
- Spark / PlayCanvas / RAD regressions preserved.

Verdict:

- major improvement over the procedural-only baseline;
- strong proof that the product direction works;
- still not a true photorealistic reconstruction;
- field-clearance outreach remains deferred.

### Phase 3P.3 — Licensed point-cloud spike

**Status: engineering complete on PR #7; final merge verification pending.**

Verified source:

- Sketchfab `BOUDHANATH STUPA - POINTCLOUD`;
- **99,992 points**;
- **0 triangles**;
- normals present;
- uniform gray `COLOR_0`, not photographic RGB;
- 4,002,328-byte GLB;
- SHA-256 recorded;
- direct Three.js point rendering verified;
- normal-shaded inspection pass verified;
- Chromium screenshot A/B completed.

Decision:

- **keep Phase 3P.2 hybrid as the default**;
- retain `/?pointcloud=1` as an evidence/debug route;
- use the point cloud as a licensed geometric source rather than a finished visual replacement.

### Phase 3P.4 — Deterministic surface reconstruction spike

**Status: next after PR #7 merge.**

Goal:

Test whether the point cloud's geometry + normals can produce a materially better surface mesh without new field capture.

Deliver:

- reproducible point extraction;
- pinned deterministic Poisson/equivalent reconstruction;
- generated mesh bounds/triangle count/checksum;
- cleanup/crop rules;
- existing MaybeBoudha material/eye/panorama treatment;
- Chromium A/B against Phase 3P.2;
- explicit adopt/reject decision.

Guardrails:

- no generative AI;
- no AI training/model development;
- preserve source GLB unchanged;
- retain CC attribution and NoAI handling;
- do not claim survey-grade accuracy.

If Phase 3P.4 still does not produce a substantial realism jump, re-evaluate **Phase 3C.2 — Field clearance** as the next meaningful source-acquisition step.

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

**Status: complete and merged in PR #3.**

### Phase 3B — PLY → RAD processing proof

**Status: complete and merged in PR #4.**

Verified on the pinned legal fixture:

- Spark v2.2.0 builder commit `4eb719afdb5b3655fe0bc290588e4728d9772405`;
- practical pinned Rust toolchain 1.88.0;
- quality Bhatt LOD;
- chunked RAD output;
- manifest/checksums/sizes;
- 206 byte-range delivery;
- `paged: true` Spark runtime;
- non-zero streamed splats;
- visual Chromium confirmation.

Use a legal test PLY before touching Boudhanath data.

Deliver:

- pinned/repeatable Spark LOD build process;
- quality/paged RAD output;
- recorded builder version/commit;
- output checksums and size;
- Spark `paged: true` browser load;
- automated or repeatable verification.

### Phase 3C — Partial Boudhanath capture

#### Phase 3C.1 — Field readiness / permission gate

**Status: complete and merged in PR #5; written clearance pending.**

Deliver:

- recheck current official heritage/site/drone sources;
- identify responsible authorities;
- prepare exact systematic-capture description;
- prepare written permission/determination questions;
- define evidence-based go/no-go rule.

#### Phase 3C.2 — Field clearance

**Status: prepared but intentionally deferred while Phase 3P validates product value.**

Require:

- Department of Archaeology written determination;
- Boudhanath Area Development Committee written determination;
- any required fee/process/conditions completed;
- approved scope recorded in provenance.

#### Phase 3C.3 — Partial field capture and source reconstruction

Only after clearance:

- capture one small ground-accessible section;
- keep raw source private;
- reconstruct in the selected cloud workflow;
- export source PLY.

No full monument/plaza capture in Phase 3C.

### Phase 3D — Partial asset cleanup and proof

Deliver:

- privacy-reviewed cleaned PLY;
- provenance record;
- PLY → paged RAD;
- browser load through Spark;
- physical desktop/mobile measurements;
- decision on whether full-site capture is viable.

### Exit criteria

A legally usable **partial Boudhanath** reconstruction loads through the selected Spark/RAD path with sufficient provenance and device evidence to plan a full capture.

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
