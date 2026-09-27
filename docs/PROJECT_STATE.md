# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The production architecture remains capable of a legitimate real-scene reconstruction, but the current product decision is to prove the visual experience synthetically before spending effort on external field clearance and real capture.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p-visual-prototype`
- Pull request: `#6 — feat: Phase 3P synthetic Boudhanath visual prototype`
- Working title: `MaybeBoudha`

## Last completed repository milestone

**Phase 3C.1 — Field readiness / permission gate**

Merged in PR #5:

`be1369876adde2f87c814df8bafb98839f40505e`

The clearance package remains valid preparation for a later real capture.

## Current product phase

**Phase 3P — Synthetic Visual Feasibility**

### Current subphase

**Phase 3P.1 — Composition baseline**

Status: **implementation and visual review complete on PR #6; final documentation-complete CI pending**

## Why Phase 3P exists

The user/product decision is:

> Build something genuinely convincing first. Only spend time on field-clearance outreach if the experience becomes good enough to justify a real reconstruction.

Therefore Phase 3C.2 is **deferred**, not deleted.

No real Boudhanath systematic capture may begin while that clearance gate remains unsatisfied.

## Phase 3P.1 delivered

Default route now presents a synthetic architectural study containing:

- approximate Boudhanath-scale monument massing;
- stepped base;
- weathered procedural white dome;
- articulated dome-base ring;
- four Buddha-eye panels;
- gilded harmika;
- thirteen-stage spire;
- upper canopy/pinnacle;
- prayer-wheel ring;
- animated radial prayer flags;
- tiled courtyard;
- ring-shaped kora path;
- surrounding multi-storey façades;
- windows, frames, cornices, parapets, shopfronts, and awnings;
- warm/cool lighting;
- atmospheric fog and procedural sky;
- cinematic camera entrance;
- orbit/zoom controls;
- reduced-motion handling;
- responsive editorial UI;
- explicit `Synthetic study · no scan data` disclosure.

Technical engineering routes remain available:

```text
?renderer=spark
?renderer=rad
?renderer=playcanvas
```

The real reconstruction delivery architecture is preserved.

## Visual verification

Second-pass screenshot was captured through the CI browser probe and inspected directly.

### Strong

- recognizable Boudhanath silhouette;
- monument dominates the composition;
- prayer flags create scale/depth;
- cinematic camera/UI direction works;
- plaza enclosure reads much better after façade refinement;
- the prototype now feels like an intentional interactive experience rather than a technical viewer.

### Still visibly synthetic

- façades are representative rather than site-accurate;
- plaster lacks scan-level microdetail;
- harmika/eyes remain simplified;
- spire ornament is still procedural;
- no photographic PBR environment/material source;
- no real crowd/incense/pigeon/ritual atmosphere;
- no capture-derived geometry.

## Phase 3P.1 verdict

**Keep the direction. Continue synthetic realism work.**

**Do not trigger field-clearance outreach yet.**

The result is good enough to justify another visual pass, but not realistic enough to justify the real capture/permission effort yet.

See:

`docs/VISUAL_PROTOTYPE.md`

## Verification

Latest implementation head reviewed:

`6c4799cebea65b3da0f6a520723492cf9250369a`

CI #98:

- locked install: passed;
- tests: passed;
- production build: passed;
- default visual prototype probe: passed;
- Spark regression probe: passed;
- PlayCanvas regression probe: passed.

RAD Pipeline #25:

- quality LOD build: passed;
- RAD/RADC generation: passed;
- manifest: passed;
- range delivery: passed;
- paged Spark runtime: passed.

A final documentation-complete verification is still required before merge.

## Next subphase

### Phase 3P.2 — Realism and material pass

Only:

- improve plaster/weathering;
- improve gold/copper material response;
- increase architectural façade detail;
- improve harmika/eye treatment;
- introduce controlled visual imperfection;
- improve environment lighting;
- improve atmospheric depth;
- refine camera composition;
- capture and inspect another visual-regression screenshot.

Do not add:

- cultural hotspots;
- audio;
- first-person navigation;
- scraped reconstruction imagery;
- real systematic field capture.

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared.

Reactivate it only when the visual prototype is compelling enough that the expected value of a real Boudhanath reconstruction justifies the permission/capture effort.

When reactivated, written determinations from the responsible authorities are still required before systematic real capture.

## Resume rule

1. inspect PR #6 and current CI;
2. read `VISUAL_PROTOTYPE.md`;
3. repository state wins over docs if they differ;
4. merge Phase 3P.1 only after documentation-complete CI and RAD regression are green;
5. create Phase 3P.2 from verified `main`;
6. do not reactivate field clearance until the visual exit question is answered yes.
