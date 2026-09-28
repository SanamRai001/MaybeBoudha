# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. The strongest existing-source geometry track has reached diminishing returns, so the current work is polishing the strongest honest hybrid rather than pretending more procedural geometry will solve the remaining source-data gap.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed milestone

**Phase 3P.6 — Real-capture go / no-go review**

Decision:

**NO-GO for field capture right now.**

Field-clearance outreach remains prepared but deferred.

See:

`docs/REAL_CAPTURE_GO_NO_GO.md`

## Current milestone

**Phase 3P.7 — Prototype polish and portfolio-ready release**

### Current subphase

**Phase 3P.7A — Presentation polish**

Status: **complete and merged**

PR:

`#11 — feat: Phase 3P.7A prototype presentation polish`

Merge SHA:

`a590d43063a976e08fd1ba73b49b3fbd235b0fb7`

Final documentation-complete verification:

- CI **#215** — green;
- tests — passed;
- production build — passed;
- default prototype browser probe — passed;
- uploaded MiniWorld model probe — passed;
- licensed point-cloud probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- final screenshot artifact — inspected directly.

## Phase 3P.7A delivered

### Loader / reveal

- non-blocking full-screen preparation state;
- compact MaybeBoudha loading mark;
- loader fades away after the actual scene reaches ready;
- story chrome reveals in stages rather than appearing abruptly;
- reduced-motion disables the new transitions/animations.

### Focus mode

A new accessible **Focus view** control:

- hides editorial/story chrome;
- reduces the vignette;
- lets the monument/environment dominate the screen;
- remains keyboard-focusable;
- can restore the normal story view.

### Interaction affordance

- temporary `Drag to explore` hint;
- repositioned after screenshot review so it no longer crowds the footer;
- existing drag/orbit and scroll/zoom instructions retained.

### Responsive presentation

- mobile header/control spacing refined;
- third-party credit hidden from the tight mobile footer while remaining documented elsewhere;
- focus control remains reachable on small screens;
- story side-note remains suppressed on smaller layouts.

## Visual review

The documentation-complete decision is based on the final Chromium screenshot from CI #214, not code inspection alone.

Result:

**Keep the Phase 3P.7A presentation changes.**

Visible gains:

- cleaner first impression;
- better hierarchy once the scene becomes ready;
- stronger option to view the monument without editorial overlays;
- bottom interaction region no longer feels crowded after the final hint-spacing correction;
- no regression to the current strongest hybrid scene.

This phase improves presentation, not monument realism.

## Current strongest visual

Default route remains:

`/`

Composition remains:

```text
MiniWorld3D lower monument
        +
refined synthetic upper monument
        +
licensed photographic eye treatment
        +
photographic Boudhanath courtyard environment
        +
animated prayer flags
        +
cinematic interaction
```

The default remains a **synthetic visual feasibility study**, not a scan or digital twin.

Engineering evidence routes remain:

- `/?pointcloud=1`
- `/?surface=1`
- `/?selective=1`
- `?renderer=spark`
- `?renderer=rad`
- `?renderer=playcanvas`

## Field-clearance state

Phase **3C.2 — Field clearance** remains deferred.

Do **not** send permission emails automatically.

## Current subphase

**Phase 3P.7B — Camera, interaction, mobile and accessibility polish**

Scope:

1. refine cinematic camera timing/handoff;
2. make reset/home framing explicit;
3. review orbit constraints and touch behavior;
4. verify focus mode with keyboard;
5. add mobile viewport screenshot coverage;
6. verify reduced-motion presentation;
7. address any responsive overlap discovered by real browser captures;
8. keep monument geometry/source unchanged.

Do not add audio yet unless 3P.7B is visually/interaction-stable.

## Resume rule

1. inspect actual `main` and post-merge CI;
2. continue Phase 3P.7B only from verified `main`;
5. use screenshot/browser evidence for every visual decision;
6. do not restart source-geometry experiments without materially better source data.
