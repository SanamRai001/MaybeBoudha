# MaybeBoudha — Evidence-Gated Improvement Roadmap

**Created:** 2026-10-29  
**Type:** Proposed work; **nothing in this document is implemented**.  
**Baseline:** `main` at `8672c70931b23a1a3e0696610ddcf43fca96fc49`.  
**Related audit:** [Product critique and evidence index](PRODUCT_AUDIT_2026-10-29.md).  
**Canonical live status:** [PROJECT_STATE.md](PROJECT_STATE.md) — do not create another operational state tracker.

## North star and stop conditions

Move from **a technically impressive synthetic visual study** to **a reliable, calm, accessible visitor experience with one validated outcome**, without misrepresenting the model as an authentic scan.

**Do not begin by building another reconstruction.** Preserve the current hybrid, reference geometry, provenance, Spark/RAD engineering experiments and field-capture NO-GO. The roadmap below purposely tests the value of interactive 3D before any irreversible capture commitment.

### Product decision, explicitly open

Two defensible directions exist:

- **Digital heritage micro-experience:** A visitor gains a correct, sourced understanding of one Boudhanath feature in a short session. A 3D scene is useful only if it materially helps.
- **Artistic/engineering portfolio experience:** A visitor feels spatial presence and appreciates the technical/artistic study. Source honesty and accessible fallback remain mandatory; cultural hotspot expansion may not be needed.

Do not claim both directions are validated. The first research milestone must select one based on intended audience, constraints and qualitative tests.

### Permanent non-goals until evidence changes

No accounts/auth/database/CMS; no VR/WebXR; no AI-generated sacred detail or use of NoAI-protected third-party source; no new background jobs; no payments/social features; no gamified religion; no new field-capture permission outreach; no migration to Next.js/React Three Fiber without a measured problem; no automatic branch cleanup; no implicit claims of survey-grade accuracy.

## How to execute this roadmap

Use small PRs against the current verified `main`. Before each code phase inspect actual git state, current source, tests, and `PROJECT_STATE.md`; remote audit SHA is a historical anchor, not permission to overwrite later work.

**Change discipline:** failing baseline where feasible → implement one bounded behavior → unit/integration/browser verification → screenshot/manual checks → docs update at milestone → PR review. Preserve third-party licenses and unrelated work. No merge, deployment or destructive branch/asset changes without explicit approval.

| Gate | Priority | Deliverable | Depends on | Ship/stop rule |
|---|---|---|---|---|
| M0 | P1 reliability | Recoverable, accessible default entry | Current prototype | Forced model failure + disabled WebGL never strand visitor |
| M1 | P1 product | Tested single visitor outcome & IA | M0 for public proof; static mock can begin earlier | First-time visitors can explain and complete a meaningful task |
| M2 | P1/P2 UX | One source-backed guided story with text alternative | M1 outcome decision | Useful with pointer, keyboard, touch and without 3D |
| M3 | P2 engineering | Isolated experiments, smaller safe modules and measured delivery | M0 regression tests; preferably M2 journey | Same visual/UX behavior; measurable complexity or load benefit |
| M4 | P2 device proof | Real-phone performance, content accessibility and release gate | M0–M3 as applicable | Pass named real-device + network matrix |
| R1 | conditional | Real-source / capture go-no-go | Outcome, field permissions and performance evidence | Approved only if source and visitor benefit justify cost |

M1 is allowed to invalidate the rest of the roadmap. If an annotated panorama wins the task comparison, simplify the default and preserve the 3D study as optional, rather than pushing ahead with the 3D-first plan.

## M0 — Reliability first (small, independently reviewable PRs)

### M0-A: End the permanent loader (`MB-08`)

**Before editing:** Trace `licensedModelRequested()`, `loadLicensedStupaModel()`, existing `sourceBaseFallback` visibility, `onReady()`, model chunks and current smoke probes. Establish a reproducible failure with one blocked chunk. Record whether loading remains stuck.

**Contract:** Distinguish model fetch/decode failure from fatal renderer failure. A failed optional packed source must reveal the existing procedural model and unblock the user.

Possible state shape, **design suggestion, not code to paste blindly**:

`type SceneLoadState = 'initializing' | 'interactive' | 'degraded' | 'failed'`

- `initializing`: no usable canvas yet; bounded loader with descriptive status.
- `interactive`: scene usable (high-res textures may still load).
- `degraded`: fallback scene is usable; user has a short explanation, Retry and Sources link.
- `failed`: no 3D renderer available; show poster + sourced text + optional Retry.

Avoid conflating model success with every texture download, and avoid multiple booleans that can become contradictory. Prefer no user-facing raw stack/error details.

**Tests and acceptance:**
- Block a single `mbv2` chunk; procedural fallback becomes visible and loading overlay clears.
- Corrupt packed bytes; invalid data is rejected without fatal blank UI.
- Simulate missing `DecompressionStream` where possible; text fallback and retry remain available.
- Retry success transitions from degraded to interactive with **one** scene, animation loop and controls instance.
- Asset-failure assertion added to deterministic browser smoke; no regression in normal production, mobile or reduced-motion paths.

**Change boundary:** `BoudhaPrototypeExperience.tsx`, `BoudhaPrototypeCanvas.tsx`, packed model loader where needed, tightly scoped tests. Do not remodel the monument.

### M0-B: WebGL and 2D recovery (`MB-09`)

**Before editing:** Confirm what exceptions happen during `new WebGLRenderer()` and on `webglcontextlost`; do not assume React's error behavior from theory. Compare the existing technical viewer fallback, but do not copy its entire orchestration.

**Behavior:** If no WebGL context can be used, show a lightweight locally hosted poster/photographic fallback, explanatory text, and a working Retry button. If the context is lost during use, suspend the loop, clean up safely, restore if possible and otherwise show fallback; avoid endless retries.

**Tests:** Emulate failure/denial of WebGL; simulate context loss where deterministic; verify poster, text, keyboard Retry, no black canvas-only screen, no leaked RAF/renderer on unmount. Keep essential sources available even if JavaScript/WebGL is unavailable where practical.

### M0-C: Fix focus and public navigation (`MB-04, MB-06`)

- When "Focus view" hides UI, prevent hidden links/actions from remaining in the tab sequence. Keep a visible and keyboard-reachable way out of Focus mode; restore focus consistently.
- Remove "Engineering proof" from the **public** header unless its RAD artifact and URL are reliably deployed and tested. Preserve developer paths and documentation.
- Always show a compact synthetic disclosure and an accessible Sources & Credits entry on mobile as well as desktop.
- Protect existing audio opt-in and reduced-motion behavior.

**Acceptance:** Tab/Shift+Tab through both focus states, keyboard activate all controls, keyboard return to normal state; no broken first-class links; synthetic status and sources reachable at 320px, 390px and desktop.

### M0 exit

A release-candidate build can survive blocked model chunks, invalid packed data, unavailable WebGL, focus-mode navigation and small screens **without a stuck overlay, unreachable UI or silent loss of essential content**. Code tests and browser checks run; no known P1 entry failures remain. This is the only phase that should precede product experimentation on the public experience.

## M1 — Decide the product outcome before adding features

### M1-A: User/audience hypothesis (`MB-01, MB-02`)

Write one short statement of primary user, intent, supported device, and outcome. Suggested *hypothesis* for testing: "A remote visitor unfamiliar with Boudhanath can learn one architectural/cultural detail and retain it after a brief guided view." Record an alternative artistic/portfolio hypothesis if appropriate.

**Do not invent cultural facts.** Recruit 5–8 varied first-time testers if feasible (including someone with a constrained phone and someone not familiar with 3D controls). These are formative usability sessions, not statistically representative research.

Questions to observe, not lead:
1. What do you believe this page is?
2. What would you do first without instruction?
3. What did you learn or experience?
4. What was difficult, slow or uncomfortable?
5. Would the same outcome be easier with an annotated photograph/panorama?

Record time to first meaningful content, unprompted task success, wrong interpretations, device discomfort, and quotations only with appropriate consent. No analytics SDK is required for this stage.

### M1-B: Competing low-cost concepts

Create **two comparable task prototypes**, potentially in static HTML/Figma/mock UI before any production 3D feature:
- Existing synthetic hybrid with **one** guided viewpoint and source-backed text card.
- Lightweight licensed photograph or panorama with the **same** text card and task.

Use the same facts and target task, randomize or balance order, and compare observed comprehension/effort. Both are allowed to succeed. The initial 3D build already exists; do not spend weeks optimizing both alternatives.

### M1-C: Content and identity decision

Write a short decision in `docs/PROJECT_STATE.md` when adopted (decision, evidence, unknowns, next milestone). Agree on:
- One product promise and intended audience;
- One tested visitor task;
- Visitor-first heading, clear source/hybrid disclosure, and a small set of actual controls;
- Whether guided viewpoint is optional, not a compulsory lengthy animation;
- Whether the experience should remain fundamentally 3D-first.

**Exit:** A reviewer can identify the target visitor, user task, reason for 3D, counterevidence and tested flow. If the study contradicts the assumption, change direction rather than building M2 blindly.

## M2 — One meaningful journey, not feature inventory

Applicable only if M1 supports an interpretive/guided experience.

### M2-A: Source-backed content record (`MB-01, MB-07, MB-16`)

Start with **one** culturally and architecturally appropriate topic. Draft/review with cited primary or reliable secondary sources; treat any translations as reviewed work, not automatic truth. Keep the scene source and editorial facts separate.

A minimal content contract could include: `id`, `title`, `shortText`, `longText`, `sources[]` (URL, publisher/author, date checked), `reviewStatus`, `cameraPresetId`, `imageAlt`, `provenanceNotes`. Avoid database and CMS. Use local typed records or static JSON validated at build/test time.

Review for: invented dates, religious misinterpretation, unsupported measurements, photo rights, accurate distinguishing of actual/approximated/procedural surfaces, and whether audio is clearly abstract rather than a Boudhanath recording.

### M2-B: Accessible explore UX (`MB-03, MB-05`)

A possible minimal flow:
1. Show an immediate low-cost preview and concise invitation; identify the synthetic study.
2. Offer **Explore freely** and **Learn one thing**; users control when to begin.
3. A guide action moves to one bounded camera preset if 3D is active; reduced motion jumps directly.
4. Open a readable contextual panel with a close control, clear sources and next/return navigation.
5. When WebGL is missing, show equivalent text and an annotated image. Do not require orbit or pointing at a tiny 3D hotspot.

Use native buttons and a single panel rather than multiple overlapping floating widgets. Manage focus on open/close; consider narrow viewports, keyboard, accessible names and contrast. Avoid scroll-hijacking and forced auto-play.

**Acceptance:** At least one user task works with mouse, touch, keyboard, reduced motion and failed 3D. No factual content exists only in the canvas; the panel is legible at 320px and typical mobile widths.

### M2-C: Keep authenticity visible

Provide an About / Sources panel that identifies MiniWorld-derived lower mesh, reference-grounded procedural sections, licensed photographic eye/courtyard assets, experimental point-cloud status, and non-authentic procedural audio. Mobile must expose credits and source conditions. Ask permission before publishing contributor interviews or identifiable visitor photos.

**Exit:** Reviewer can trace each factual claim to a source and each visual asset to an attribution; first-time users can finish the chosen task without specialist 3D knowledge.

## M3 — Simplify the architecture only after behavior is protected

### M3-A: Measure before performance edits (`MB-11, MB-13`)

Record production bundle analysis, number/weight of initial JS requests, first render, usable scene delay and route-specific failures. Separate source evidence from real-phone measurements. Keep numbers in one benchmark note attached to the PR, not a new evergreen state document.

**Do not assert a guaranteed improvement from dynamic import.** Vite may already split chunks differently; inspect actual output.

### M3-B: Isolate technical experiment imports (`MB-11, MB-06, MB-14`)

Use route-level lazy imports for Spark/PlayCanvas, point-cloud and surface experiments, with suspense/error boundaries as appropriate. The public entry should not require test fixtures, their remote CDN dependencies or query-only debug URLs in ordinary navigation. Document experimental URLs as **untrusted developer inputs**; whitelist scene URLs for public builds if a debug route remains exposed.

**Acceptance:** Default route loads and behaves identically; engineering routes still pass their smoke; built default path no longer requires experimental chunks; measured initial code/requests are recorded.

### M3-C: Extract real responsibilities (`MB-12`)

Refactor in incremental PRs (do not do all in one):
1. Scene-load orchestration, recoverable states, disposal.
2. Camera transition/state controller: `intro → home/explore` and `reset → home`, with user interrupt.
3. Scene-building and texture/resource ownership.
4. Quality policy and observability (only after data).

Keep production conventional Three.js scene distinct from experimental Spark reconstruction renderer; both may share **intent contracts** (viewpoint, load/error), not forced GPU internals.

**Acceptance:** Screenshot baseline still recognizable; geometry metrics and reference-calibration tests pass; camera transitions, context-loss/retry, cleanup and resize are tested; no duplication of animation loops or event listeners; code is easier to isolate in focused tests. LoC reduction by itself is **not** success.

### M3-D: Avoid speculative infrastructure

No backend, database, server-side scene editor, CMS or user accounts until a concrete use case makes static typed content inadequate. Refuse large rewrites for prettier folders. Keep `docs/PROJECT_STATE.md` as the only live checkpoint, with architecture ADRs for meaningful decisions.

## M4 — Physical-device and accessible release proof

### Test matrix

| Scenario | Expected evidence |
|---|---|
| Desktop Chromium, normal connection | Visual readiness, smooth input, no stuck status, all interaction tasks |
| Real Android mid-range, mobile data | Record measured load/interaction, memory symptoms and touch usability |
| Narrow screen 320px and 390px | No hidden source access, no control collision, readable panel |
| Keyboard only | All key views/text achievable; no invisible focus targets |
| Screen reader on supported browser | Controls announce purpose/state; guide/panel/source content readable |
| Reduced motion | No forced orbit/camera travel; core task still complete |
| WebGL unavailable / context lost | Poster/text accessible and retry does not loop forever |
| Blocked/corrupt packed model or photo | Fallback and accurate degraded state |
| Offline/slow network after initial shell | Failure explained; no unbounded loader; partial content where possible |
| Dev experiment routes | Tests still work without polluting visitor experience |

Use normal and network-throttled testing. Set actual performance budgets **after** collecting device baselines (e.g. user-visible first content, interaction latency, stable frame time, memory behavior); do not proclaim a 30/60 FPS guarantee based on software-rendered CI.

**Release gate:** Documentation and legal credits accurate; accessible primary task; static fallback works; measurable device data and screenshot evidence attached; CI/npm checks green; no unreviewed third-party assets.

## R1 — Evidence-based real capture decision (not scheduled)

Keep [REAL_CAPTURE_GO_NO_GO.md](REAL_CAPTURE_GO_NO_GO.md) authoritative: **NO-GO** for permission outreach and systematic field capture until evidence justifies a new decision.

To reopen, require:
- Materially better, **legally usable** source prospects with clear capture/usage rights, or a credible permitted field opportunity;
- Specific accuracy/provenance and privacy constraints and permission review;
- Visitor evidence that richer true 3D materially advances the chosen goal;
- Realistic storage/process, mobile delivery and long-term stewardship estimate;
- A rollback plan preserving the synthetic study and source disclosures.

If reactivated, separate scene build pipeline from frontend release and publish a source manifest. Do not describe reconstructed areas as survey-grade without independent evidence.

## Priority backlog and proposed PR breakdown

| PR candidate | Evidence IDs | Risk | Validation focus |
|---|---|---|---|
| `fix/prototype-model-load-fallback` | MB-08 | High | Fail packed chunk; recover and retry; no leaked loops |
| `fix/prototype-webgl-fallback` | MB-09 | High | Disable WebGL/context loss; accessible 2D fallback |
| `fix/focus-mode-navigation` | MB-04, MB-05 | Medium | Keyboard and mobile visible/source access |
| `fix/public-experiment-link` | MB-06 | Low | No broken public destination; preserve internal routes |
| `research/visitor-task-comparison` | MB-01, MB-02 | Low code / high strategy | 3D vs panorama task and interviews |
| `feat/one-guided-heritage-story` | MB-01, MB-03, MB-07 | Medium | Sources, keyboard, reduced motion, no 3D |
| `perf/split-experiment-routes` | MB-11, MB-14 | Medium | Bundle delta and smoke regressions |
| `refactor/prototype-scene-ownership` | MB-12, MB-13 | Medium/high | Lifetime/disposal/camera regression |
| `docs/credits-licenses-and-state` | MB-15–MB-17 | Low/decision | Source audit and attribution visibility |
| `chore/branch-inventory` | MB-18 | No deletion | Unique commits and safe candidate list |

The names are suggestions, not branches that already exist. Keep each PR reviewable and refrain from parallel changes to the same scene ownership files.

## Lightweight verification on Windows (PowerShell)

From a **clean, correctly selected worktree** of the implementation PR:

```powershell
git status --short --branch
git log -1 --oneline
npm ci
npm test
npm run build
```

Expected: appropriate branch/HEAD and no unreviewed edits; locked dependency installation, tests and production build succeed. This roadmap has **not** executed these commands. If any fail, save exit codes and error details before continuing.

For browser runtime smoke, the existing `scripts/runtime-smoke.mjs` expects a Chromium executable via the `CHROME` environment variable and a locally running Vite preview. Supply a verified browser path; do not assume the installed Chrome/Chromium location:

```powershell
# Terminal 1
npm run preview -- --host 127.0.0.1 --port 4173

# Terminal 2 (replace with your actual Chromium/Chrome path)
$env:CHROME = 'C:\path\to\chrome.exe'
node scripts/runtime-smoke.mjs prototype "$env:TEMP\maybeboudha-prototype.png"
```

Successful smoke confirms the current scripted pathway only; it does **not** replace the explicit new negative tests or physical-device manual checks described above. Review generated screenshots.

### End-to-end manual review before a release

Test in this order: default load → prompt initial scene perception → free explore → reset → focus on/off with Tab → open source/credits → run one guided task → simulate no WebGL → simulate asset failures → verify mobile/reduced motion → inspect production bundle/performance. Mark each PASS/FAIL/UNRUN, include environment and evidence links.

## Explicit completion and handoff requirements

For each M phase report: **implemented changes, affected files, user-visible impact, tests that passed, tests unrun, known risks and next decision**. Update `docs/PROJECT_STATE.md` at meaningful adopted/implemented milestones with branch/HEAD and proof; avoid duplicate tracking files. If conflicting source/Git evidence appears, amend the plan before implementing.

**Final success is not a prettier renderer or more components.** It is a visitor who gets a trustworthy and meaningful experience—even on a constrained device and even when 3D cannot load—without losing the work already done on the visual/reconstruction research.
