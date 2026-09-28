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

**Status: complete and merged in PR #7.**

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

**Status: complete and merged in PR #9.**

Verified:

- deterministic extraction of 99,992 transformed points + normals;
- Open3D 0.20.0 Poisson depth 9;
- 110,643 output vertices;
- 220,000 output triangles;
- source/output checksums;
- density cleanup + bounds crop;
- Float64 PLY → Float32 WebGL compatibility layer;
- successful Chromium surface proof.

Decision:

- **do not replace the Phase 3P.2 hybrid**;
- keep `/?surface=1` as evidence/debug;
- retain the reconstructed mesh as a licensed geometric source.

Reason:

The continuous surface is recognizable and geometrically useful, but lacks photographic RGB and fine architectural/material fidelity.

### Phase 3P.5 — Selective geometry hybridization

**Status: complete and merged in PR #10.**

Verified:

- deterministic dome/body crop from the Phase 3P.4 Poisson surface;
- broad reconstructed ground rejected;
- reconstructed harmika/spire rejected in favor of the stronger existing upper monument;
- MiniWorld base retained;
- photographic panorama and eye treatment retained;
- final source crop: **59,011 / 220,000 triangles**;
- final crop region: **7.10–23.45 m Y**, max radius **19.70 m**;
- Chromium A/B completed;
- CI #203, Surface Reconstruction #23, and RAD Pipeline #114 green on the final implementation head.

Decision:

- **do not replace the Phase 3P.2 default hybrid**;
- keep the selective route as engineering evidence;
- the reconstructed dome is source-specific but the lower transition remains visually rougher than the existing hybrid.

See `SELECTIVE_HYBRID_SPIKE.md`.

### Phase 3P.6 — Real-capture go/no-go review

**Status: complete.**

Decision:

**NO-GO for field capture right now.**

The current hybrid proves the product direction but remains visibly synthetic and does not yet meet the user's threshold for spending time on permission outreach/new capture.

Keep Phase 3C.2 prepared but deferred.

See `REAL_CAPTURE_GO_NO_GO.md`.

### Phase 3P.7 — Prototype polish and portfolio-ready release

Goal:

Polish the strongest current hybrid as an honest, deployable visual/engineering prototype without repeating low-value geometry experiments on the same source.

#### Phase 3P.7A — Presentation polish

**Status: complete and merged in PR #11.**

Delivered:

- non-blocking loader/reveal;
- staged story-chrome entrance;
- accessible Focus view / Show story control;
- cleaner interaction hinting;
- mobile-safe header/footer adjustments;
- reduced-motion handling for the new presentation layer;
- screenshot-driven footer/hint correction.

Verified on implementation head `93f95f4045d9b78c12a2b983a799ea7175498962`:

- CI #214 — green;
- tests/build — passed;
- default prototype — passed;
- uploaded-model probe — passed;
- point-cloud probe — passed;
- Spark / PlayCanvas regressions — passed;
- final screenshot inspected directly.

#### Phase 3P.7B — Camera, interaction, mobile and accessibility polish

**Status: complete and merged in PR #12.**

Delivered:

- cinematic camera yields immediately to user interaction;
- explicit home/reset camera state;
- calmer orbit/zoom tuning;
- keyboard-activated Focus mode and Reset view proof;
- 390 × 844 mobile screenshot coverage;
- horizontal-overflow assertion;
- real emulated touch-drag proof;
- reduced-motion browser emulation and screenshot;
- existing MiniWorld / point-cloud / Spark / PlayCanvas / RAD / surface regressions preserved.

Implementation verification:

- head `a24d31c1ac83726ab1bc65d63b8ae9835525c763`;
- CI #223 — green;
- RAD Pipeline #123 — green;
- Surface Reconstruction #32 — green.

Documentation-complete verification:

- head `aca3a9808d2a5b6a9a10759f8b5533e87fa8c2cf`;
- CI #226 — green;
- RAD Pipeline #126 — green;
- Surface Reconstruction #35 — green.

Merge SHA:

`942ef9a36554d2bd1f1be06097bc0c4b0e4708a9`

See `PHASE_3P7B_INTERACTION_MOBILE.md`.

#### Phase 3P.7C — Environment, atmosphere and performance polish

**Status: complete and merged in PR #13.**

Delivered:

- calmer multi-axis prayer-flag motion;
- reduced-motion-safe flag behavior;
- eased photographic-environment cross-fade;
- refined fog/exposure/sun/fill balance;
- device-aware mobile / balanced / high quality tiers;
- bounded renderer DPR;
- tier-aware shadow-map size and anisotropy;
- lightweight smoothed FPS telemetry;
- deterministic browser assertions for quality/DPR/FPS;
- desktop/mobile/reduced-motion screenshot review;
- existing MiniWorld / point-cloud / Spark / PlayCanvas / RAD / surface regressions preserved.

Verified on implementation head `61e5cdf1149264c51e00362508e98ca7193bd7f0`:

- CI #231 — green;
- RAD Pipeline #128 — green;
- Surface Reconstruction #37 — green.

See `PHASE_3P7C_ATMOSPHERE_PERFORMANCE.md`.

#### Phase 3P.7D — Ambient sound and release readiness

**Status: complete and merged in PR #14.**

Delivered:

- opt-in procedural Web Audio ambience;
- sound off by default;
- real keyboard user-activation proof;
- Sound on/off accessible state;
- hidden-page suspension behavior;
- no external audio asset or field-recording claim;
- audio provenance documentation;
- honest title/description + Open Graph/Twitter metadata;
- site web manifest and robots policy;
- 390 × 844 mobile proof with Sound / Reset / Focus visible;
- desktop/mobile screenshot review;
- existing MiniWorld / point-cloud / Spark / PlayCanvas / RAD / surface regressions preserved.

Verified on implementation head `e97313ad94137db2ff544af0ba2e45ffbc3fd125`:

- CI #239 — green;
- RAD Pipeline #133 — green;
- Surface Reconstruction #42 — green.

See `PHASE_3P7D_AUDIO_RELEASE.md`.

#### Phase 3P.7E — Public prototype deployment and portfolio packaging

**Status: next.**

Build:

- choose the actual hosting target;
- deploy the current release candidate without monument/source changes;
- add canonical URL and `og:url`;
- publish a hosted social-preview image;
- verify production cache/asset delivery;
- production URL desktop/mobile smoke;
- capture final portfolio media.

Later 3P.7 work may include:

- environment/flag/atmosphere refinement;
- optional ambient sound with explicit controls;
- performance review;
- public deployment readiness;
- portfolio media/screenshots.

Guardrail:

Do not restart field clearance or claim real reconstruction unless a genuinely better source path appears or the user explicitly changes the decision.

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
