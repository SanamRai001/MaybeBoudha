# MaybeBoudha — Critical Product & Engineering Audit

**Review date:** 2026-10-29  
**Repository:** [SanamRai001/MaybeBoudha](https://github.com/SanamRai001/MaybeBoudha)  
**Evidence baseline:** `main` at [`8672c70931b23a1a3e0696610ddcf43fca96fc49`](https://github.com/SanamRai001/MaybeBoudha/commit/8672c70931b23a1a3e0696610ddcf43fca96fc49), 2026-10-04  
**Status:** Review and proposals only. No application code, assets, permissions, deployment, or field capture changed.  
**Companion:** [Implementation roadmap](IMPROVEMENT_ROADMAP_2026-10-29.md).

## 0. Executive decision

**Keep MaybeBoudha; narrow its next investment.** It has credible browser-graphics research, useful source/provenance records, and a distinctive visual prototype. But today the strongest evidence supports **a synthetic Boudhanath visual study**, not a photorealistic reconstruction, a digital twin, or an established visitor/educational product. The default experience offers cinematic orbit, reset, focus and optional procedural audio; it does not yet offer the sourced heritage exploration promised in `docs/PRODUCT_VISION.md`.

The biggest product question is **whether interactive 3D creates a meaningful visitor outcome over an excellent annotated photo/panorama**. Prove this before extending the renderer, sourcing expensive captures, adding VR, or building a CMS. The largest operational defect to fix first is the default packed-monument loading path, which can leave the visitor behind the loader after a failed request.

**Recommended product promise to test, not assert as established:** "Explore Boudhanath through a calm, clearly labeled visual study and discover one well-sourced architectural or cultural story." The alternative is a deliberately artistic, non-educational visual portfolio piece; choose explicitly instead of accidentally promising both.

### What this review did and did not verify

- **SOURCE-VERIFIED:** Current `main` source tree, package configuration, UI components/CSS, scene setup, asset flow, docs and workflow configuration. Links below pin the inspected SHA.
- **RECORDED:** On 2026-10-04, GitHub CI and Pages workflows completed successfully for the inspected SHA. Earlier docs record production/mobile browser smoke and software/CI-rendered screenshots. Those are historical checks, not fresh runs.
- **RISK / DESIGN CRITIQUE:** Consequences inferred from code, not necessarily reproduced incidents.
- **UNKNOWN:** Live render/pixel quality, real-time production availability, fresh bundle output, physical Android/desktop FPS, memory, energy consumption, color contrast, screen-reader usability, licensing counsel, and visitor study results. This review did not run a local build, load an interactive live browser page, or conduct field research. Public live URL could not be inspected with the available browsing path.

Severity: **P0** = stop-ship where normal public use is blocked or unsafe; **P1** = high user-facing reliability/accessibility/value risk; **P2** = important product or engineering improvement; **P3** = lower-priority housekeeping/option. A source-backed conditional failure is not automatically proof of a currently failing production visit.

## 1. Critique of the previous critique

Previous recommendations were partly too prescriptive:

1. **"Add 3–5 hotspots" is premature.** A hotspot count is a feature metric, not visitor success. First test one credible, useful story (with text-only access and a guided camera preset). Expand only if people use it and accurately understand its content.
2. **"Refactor the 1,664-line scene now" risks a rewrite disguised as cleanup.** The monolith is a maintenance risk, but extract responsibilities incrementally after failure and camera behavior are tested. Do not migrate renderers or invent a generalized plugin system.
3. **"Improve realism further" repeats work at diminishing returns.** `REAL_CAPTURE_GO_NO_GO.md` already concludes the limiting factor is source quality; the right next step may be better product context or stronger source acquisition, not extra procedural detail.
4. **"Adaptive quality" lacks device evidence.** Quality heuristics already exist. Measure first, offer a predictable manual quality option if needed, and only later justify dynamic tuning.
5. **"44px controls are a WCAG failure" would overclaim.** Existing mobile button min-heights are as low as 30px. This deserves ergonomic testing and larger targets where feasible, but size alone does not establish every WCAG 2.2 target-size exception/spacing condition.
6. **"Build a comprehensive heritage platform" is scope creep.** No backend, accounts, CMS, WebXR, payments, or multilingual engine until a tested visitor need requires them.

## 2. Actual architectural baseline — not the aspirational diagram

`src/App.tsx` statically imports the default prototype and several experimental experiences. The **default `/` route** renders `BoudhaPrototypeExperience`, whose `BoudhaPrototypeCanvas` builds a conventional **Three.js mesh-based** synthetic/hybrid scene. It loads a compact packed MiniWorld3D lower model; shapes a reference-grounded synthetic dome/harmika/spire; adds a licensed eye photo, photographic courtyard panorama, prayer flags and optional procedural audio. This is **not** the production Spark/paged-RAD reconstruction on the default path.

Spark 2.2.0, direct Three.js integration, paged RAD/LOD, and PlayCanvas remain legitimate **renderer/delivery research and intended future capture architecture**; they are selectable engineering routes. Do not conflate a tested fixture pipeline with a full captured Boudhanath scene in production.

The source inventory contains `boudhanath_stupa_-_pointcloud.glb` (~4 MB), four compact browser model chunks, renderer probes, a deterministic Poisson reconstruction experiment and extensive capture/provenance documentation. Existing CI builds/tests and executes Chromium smoke probes, including emulated mobile and reduced-motion cases.

Evidence: [App entry](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/App.tsx), [default scene](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx), [renderer ADR](ADR-001-RENDERER-AND-SCENE-FORMAT.md), [technical plan](TECHNICAL_PLAN.md), [asset rights](THIRD_PARTY_ASSETS.md).

## 3. Findings — product and UX

### MB-01 · P1 · Visitor outcome is undefined in the shipped experience — SOURCE-VERIFIED product gap

**Evidence:** [Product vision](PRODUCT_VISION.md) calls for guided viewpoints and 3–5 sourced informational hotspots. [Default UI](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeExperience.tsx) exposes an engineering proof link, sound, reset, focus, and descriptive copy, but no sourced story or navigable hotspot.

**Why it matters:** First-time visitors may admire the geometry but learn little or have no reason to continue. A technically difficult 3D scene is not a validated visitor experience.

**Change:** Choose one outcome (artistic presence or an educational micro-journey), then test one sourced story and one guided view against a static annotated panorama baseline. Do not assume education is desired without user interviews. **Proof:** In 5–8 qualitative sessions, first-time testers can explain what the page offers, complete the chosen task, and accurately summarize the content. Record contrary feedback too.

### MB-02 · P2 · Landing copy talks to developers rather than visitors — SOURCE-VERIFIED, qualitative assessment

**Evidence:** The headline is "Boudha, before the scan," and the subtitle says "synthetic architectural study"; the right-hand architecture/atmosphere annotations are not actionable. See [default UI](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeExperience.tsx).

**Why:** "Before the scan" and "visual feasibility" explain project process, not why to explore. The technology disclaimer is vital, but it need not dominate the promise.

**Change:** Make "Explore Boudhanath" and the intended visitor outcome prominent; retain an unambiguous "synthetic / not a scan" notice and full source explanations in About. Test two copy variants without obscuring truth. Avoid unnecessary call-to-action clutter.

### MB-03 · P1 · No accessible equivalent to 3D exploration — SOURCE-VERIFIED gap

**Evidence:** [OrbitControls and canvas](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1093-L1109) provide pointer/touch orbit and wheel zoom. Main controls are native buttons, and keyboard reset/focus tests exist, but there is no equivalent list of meaningful viewpoints or text presentation of place information.

**Why:** Operating Focus and Reset via keyboard is not equal to experiencing the content. A graphics-only journey excludes some visitors.

**Change:** Add native-button viewpoint selection, a structured text story, and a usable poster/fallback. Ensure information is fully available without entering the canvas. **Proof:** Keyboard-only and screen-reader visitors can reach and understand the same key content.

### MB-04 · P1 · Focus mode can hide focusable content only visually — SOURCE-VERIFIED

**Evidence:** [`styles.css` focus rules](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/styles.css#L986-L1004) apply `opacity: 0` and `pointer-events: none` to content including brand/links, without removing them from tab order.

**Why:** Keyboard users may tab to invisible links. This is a focus-management risk even if pointer interaction passes tests.

**Change:** Render an accessible focus-mode state, hide inactive interactive descendants using semantically correct mechanisms, preserve an obvious exit, and restore sensible focus. **Proof:** Tab through focus-on and focus-off; no invisible focused controls.

### MB-05 · P2 · Narrow-screen control ergonomics and disclosure visibility — SOURCE-VERIFIED

**Evidence:** [`styles.css` mobile rules](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/styles.css#L1115-L1160) permit 30px min-height controls, hide some header metadata, and wrap actions; [earlier mobile rules](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/styles.css#L601-L649) hide the synthetic disclosure; [later rules](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/styles.css#L1064-L1073) hide the attribution link.

**Why:** Small adjacent controls increase mistaken taps; essential provenance/credits become hard to find on phones.

**Change:** Test 320–430px layouts, target comfortable touch areas (prefer ~44px where space permits), keep concise visible synthetic disclosure, and provide an accessible Sources & Credits link on every viewport. Do a license/attribution review; do not automatically claim a legal breach.

### MB-06 · P2 · Technical experiment is public-facing navigation — SOURCE-VERIFIED

**Evidence:** [default header](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeExperience.tsx) exposes `?renderer=rad` as "Engineering proof." [README](../README.md) says RAD files are generated separately and not prepared during normal development; no `public/rad` assets are in the inspected tree.

**Why:** The UI advertises a route whose required asset is not part of the ordinary published scene; visitor-facing UX should not depend on an engineering fixture.

**Change:** Move engineering links to the README/developer section, or independently verify and publish the required fixture. **Proof:** Every user-visible destination works in the deployed build.

### MB-07 · P2 · Source-derived realism and editorial interpretation need a clear boundary — VERIFIED disclosure exists; RISK of misunderstanding

**Evidence:** [Third-party assets](THIRD_PARTY_ASSETS.md) explain the printable model's nonuniform scale correction, photographic surroundings, synthetic components, and abstract rather than site-authentic audio; the UI truthfully says "synthetic" but supplies little detail.

**Why:** A faithful-looking religious landmark can suggest unearned architectural precision or authentic sound.

**Change:** Use a compact provenance card listing real photo / source-based geometry / procedural reconstruction / unknowns. Have historical and religious explanatory material reviewed by a qualified source or community contributor. Preserve current "not a scan/digital twin" boundary.

## 4. Findings — resilience, performance and architecture

### MB-08 · P1 · Default model-load failure leaves loader unresolved — SOURCE-VERIFIED conditional defect

**Evidence:** [`licensedModelRequested`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/prototypeModelMode.ts) defaults to the packed model; [model load `catch`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1184-L1229) logs failure but never changes `licensedModelReady`; [`onReady` gate](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1614-L1624) requires it; [loader UI](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeExperience.tsx) waits on that callback.

**Why:** Failed chunk download, unsupported decompression, or invalid geometry can leave a permanent blocking overlay even while procedural fallback geometry exists.

**Change:** Model terminal asset states (usable/degraded/error), clear the loader on recoverable failure, reveal the fallback and user-visible explanation, enable Retry without leaking renderers. **Proof:** Block each `mbv2-*.b64` request and test: fallback appears, page remains usable, retry works; test invalid contents and absence of `DecompressionStream`.

### MB-09 · P1 · Default WebGL/context-failure UX is not explicitly handled — SOURCE-VERIFIED coverage gap, runtime outcome UNKNOWN

**Evidence:** [default canvas setup](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1060-L1090) directly constructs a `WebGLRenderer` inside an effect; the [prototype shell](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeExperience.tsx) has no explicit 2D failover. Separate **technical** renderer views do have retry/fallback UI.

**Why:** Lack of WebGL, GPU memory pressure, or context loss can strand a visitor. Whether React catches a particular effect exception is not a substitute for a designed recovery flow.

**Change:** Establish a clear renderer state and a lightweight poster/text alternative; capture init, context-loss and restore/failure outcomes. **Proof:** WebGL-disabled and synthetic context-loss browser probes show meaningful content with an accessible retry.

### MB-10 · P2 · "Ready" is not a precise indication of visual completeness — SOURCE-VERIFIED

**Evidence:** [`onReady`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1614-L1624) depends on model readiness, while [panorama and eye photo loading](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1310-L1399) continues independently.

**Why:** Progressive visual improvement is fine; claiming full readiness for a partial composition is misleading when content fails quietly.

**Change:** Define "interactive-ready" separately from "high-fidelity assets ready"; show quiet fallback/sources status only when material to users. Do not add a complex percentage loader without accurate progress information.

### MB-11 · P2 · Experimental routes are statically imported at entry — SOURCE-VERIFIED code, size impact UNMEASURED

**Evidence:** [`src/App.tsx`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/App.tsx) statically imports technical, point-cloud, surface and prototype experiences. [`PROJECT_STATE.md`](PROJECT_STATE.md) records a historical deployed JS asset of ~3.76 MB (not a fresh bundle profile).

**Why:** Experimental dependency graphs may inflate startup parse/evaluation and make visitor performance sensitive to code not used on `/`.

**Change:** Measure the current bundle, then lazy-load experiment routes with separate imports and add a route-level fallback. Keep probes for engineering. **Proof:** Before/after bundle analyzer and real-browser startup timing show no behavior regression; record whether splitting actually improved loading.

### MB-12 · P2 · Scene orchestration mixes too many responsibilities — SOURCE-VERIFIED structure

**Evidence:** [`BoudhaPrototypeCanvas.tsx`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx) is ~1,664 lines spanning geometry generation, photographic texture loading, camera state, animation, renderer lifetime, stats and cleanup.

**Why:** Harder to review failure boundaries and test lifecycle invariants; small changes can create cross-cutting regressions.

**Change:** After MB-08/09 tests, extract **only** loading-state, camera-state and scene-build responsibilities with explicitly owned setup/disposal. Do not rewrite the rendering engine or introduce an unnecessary abstraction framework. **Proof:** Existing screenshots/interaction tests unchanged, no orphan animation loops or GPU resources, coherent module responsibilities.

### MB-13 · P2 · Hardware quality inference is a heuristic, not measured capability — SOURCE-VERIFIED

**Evidence:** [`prototypeQuality.ts`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/prototypeQuality.ts) selects a tier based on viewport, hardwareConcurrency, deviceMemory and DPR at start. [scene](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/prototype/BoudhaPrototypeCanvas.tsx#L1063-L1087) uses it once.

**Why:** Viewport and CPU hints do not guarantee GPU throughput; virtualized CI FPS is not physical-device performance.

**Change:** Document support targets, test real Android/desktop (load time, input lag, memory, stability), provide a manual quality fallback if evidence demands. Treat automatic dynamic adaptation as a later experiment only.

### MB-14 · P2 · Debug scene URL accepts query input — SOURCE-VERIFIED surface, impact not assessed

**Evidence:** [`sparkSceneConfigFromSearch`](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/experience/renderer/sparkSceneConfig.ts) accepts `?scene=...` as a URL for the RAD debug viewer.

**Why:** Arbitrary scene URLs may cause unplanned cross-origin requests and fragile/deceptive debug links. **This is not an established exploit or credential leak.**

**Change:** Keep experimental URLs internal to development or restrict against an explicit allowlist for public builds, and avoid displaying unsanitized URLs as trusted assets. Add harmless negative tests. Do not build a backend for this.

## 5. Findings — repository, provenance and deployment

### MB-15 · P2 · Documented release instructions contradict current release — SOURCE-VERIFIED

**Evidence:** [README](../README.md) correctly describes the custom root domain and also ends with older "Enable GitHub Pages once" instructions. [`PROJECT_STATE.md`](PROJECT_STATE.md) names the custom domain while retaining a project-path URL, earlier deployment cache paths and historic phase checkpoints.

**Why:** Contributors and coding agents can make the wrong release-base or assume deployment has not happened.

**Change:** Repair immediate README guidance now; after review, reconcile `PROJECT_STATE.md` using the actual branch/release state, retaining a compact historical changelog as needed. There must be **one** canonical live project-state file.

### MB-16 · P2 · Credits are documented but not consistently discoverable — SOURCE-VERIFIED; rights consequence UNKNOWN

**Evidence:** [Third-party assets](THIRD_PARTY_ASSETS.md) records MiniWorld3D geometry, CC BY-SA eye photo, public-domain panorama and Sketchfab NoAI point-cloud restrictions. [mobile CSS](https://github.com/SanamRai001/MaybeBoudha/blob/8672c70931b23a1a3e0696610ddcf43fca96fc49/src/styles.css#L1064-L1073) hides the eye-photo credit link.

**Why:** Documentation-only credits do not necessarily satisfy an accessible experience or distribution license obligations. License conditions need careful asset-by-asset review.

**Change:** Accessible in-product credit panel; source/author/license/changes details; review packaging and third-party terms before additional uses. Respect point-cloud NoAI limitation; do **not** feed that asset to generative tools.

### MB-17 · P2 · Source license for application code is not declared — SOURCE-VERIFIED tree

**Evidence:** Inspected repository tree has no root `LICENSE`; third-party assets have separately documented terms.

**Why:** Public visibility does not grant standard reuse rights. Conversely, a license covering original code must not claim broader rights over third-party assets.

**Change:** Decide whether to permit redistribution of original project code, select a license and describe exclusions for source data/assets. This is a separate product/legal decision; do not silently select one.

### MB-18 · P3 · Historical experimental branch inventory needs safe housekeeping — SOURCE-VERIFIED metadata

**Evidence:** The reviewed repository listed many phase/spike/fix branches even though `main` had no open PR at review time.

**Why:** Branch sprawl can mislead future work, but automatic deletion risks losing historical experiment state.

**Change:** Inventory ahead/behind counts, open PRs, merged/rebased status, and unique commits. Propose deletions only after verifying recoverability and explicit approval. No branches deleted in this review.

## 6. Things the team did well — preserve them

- **Honest labeling:** Main README and UI avoid calling synthetic hybrid a scan/digital twin.
- **Evidence discipline:** Pinned asset checksums, renderer spike docs, reconstruction comparisons and real-capture NO-GO reduce magical thinking.
- **Appropriate infrastructure restraint:** Static Vite/React app without speculative server/accounts is right for the present need.
- **Operational baseline:** Locked npm dependencies; CI build/tests plus actual Chromium browser smoke, with mobile/reduced-motion flows (historical evidence).
- **Interaction details:** Intro yields to pointer input, reset works, reduced-motion and opt-in/paused audio were deliberately addressed.
- **Asset governance:** Third-party licensing, capture consent, provenance and the limitations of the sparse monochrome point cloud are documented.

Do not discard these advantages for cosmetic novelty or a framework migration.

## 7. Decision gate: does this need to be a 3D application?

Before financing a new capture, evaluate the same visitor task on two prototypes:

| Candidate | Strength | Cost/risk | Decision metric |
|---|---|---|---|
| Existing 3D hybrid + one guided story | Spatial presence, interactive orbit | GPU/device dependence, source limitations | Task success, comprehension, comfort, load reliability |
| Well-annotated licensed panorama/photo sequence | Fast, accessible, authentic imagery | Less freedom of viewpoint | Same task success and comprehension metrics |

Use neutral, balanced participant order; don't market the 3D version as objectively better. Record first meaningful image, time-to-task, failed interactions, reported nausea/discomfort, understanding, and whether participants choose to continue. Five to eight qualitative testers are for discovering issues, **not statistical market proof**. If 3D adds little for the desired task, use the panorama as the default and keep 3D as an optional enhancement. If the project is primarily a visual-art portfolio, make that an explicit choice with different success criteria.

## 8. Constraints and immediate next decisions

1. **First fix MB-08 and MB-09** before product expansion; use a dedicated branch and induced failures in browser tests.
2. **Decide the audience and core outcome**, then prototype one sourced story, not an entire content platform.
3. **Only then separate concerns and optimize** with before/after metrics; preserve the current renderer research.
4. **No field-capture outreach yet:** current [real-capture gate](REAL_CAPTURE_GO_NO_GO.md) remains NO-GO. Do not send committee/authority emails automatically.
5. **Do not merge or deploy audit recommendations automatically.** Every finding needs a separate implementation decision and evidence of passing acceptance criteria.

See [the phased improvement plan](IMPROVEMENT_ROADMAP_2026-10-29.md) for scope, exact exits, dependencies, PowerShell verification commands and stop rules.
