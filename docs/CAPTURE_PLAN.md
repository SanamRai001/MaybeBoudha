# Boudhanath Capture Plan

## Purpose

This document defines how MaybeBoudha should obtain its first **real partial Boudhanath reconstruction** without turning the project into an uncontrolled full-site scan.

The first goal is not the entire Stupa.

The first goal is to prove that we can:

1. capture a small real section legally and respectfully;
2. reconstruct it cleanly;
3. export a Gaussian Splat PLY;
4. remove privacy/noise artifacts;
5. convert it to the selected Spark delivery path;
6. load it in the MaybeBoudha browser experience.

Only after that proof should the project plan a full monument/plaza capture.

---

## Capture policy

### Ground-only by default

The baseline Phase 3 capture plan uses **no drone**.

Current CAAN UAS requirements include restrictions around populated areas and other operating conditions. Boudhanath is a busy public heritage area, so aerial capture must be treated as a separate permitted operation rather than an assumed part of the project.

Official references:

- CAAN drone information: https://caanepal.gov.np/functions/general-aviation/drones
- CAAN UAS Requirements: https://caanepal.gov.np/storage/app/media/drone/sep%2024%202022/UAS%20Requirement%20final.pdf

If aerial capture is ever needed, do not fly until the required aviation, local/site, and heritage permissions have been confirmed in writing.

### Heritage/site consent

Systematic reconstruction capture is more than casual tourist photography.

The Nepal Department of Archaeology publishes photography/documentation and ancient-monument filming/consent services in its citizen charter:

https://doa.gov.np/pages/817310553/

Before the real partial capture:

- follow the GO / NO-GO gate in `PHASE_3C_FIELD_READINESS.md`;
- obtain written determinations from the Department of Archaeology and the Shree Boudhanath Area Development Committee;
- complete any required permission/fee/process;
- keep written approval/reference evidence with the private capture record;
- record the approved scope in the capture manifest.

Do not assume an entrance ticket is permission for reconstruction/commercial publication.

### Elevated imagery

Preferred order:

1. legal public ground positions;
2. fixed elevated viewpoint with property/site permission;
3. temporary pole/monopod only if site rules allow it;
4. drone only as a separately approved operation.

A nearby rooftop with permission is preferable to introducing drone risk for the first proof.

---

## Phase 3 partial-capture scope

### What to capture first

Choose **one ground-accessible, mostly static exterior section**, not the whole Stupa.

Target envelope:

- approximately 8–15 m of visible architectural frontage/structure;
- enough depth to include foreground, subject, and a small amount of surrounding context;
- no restricted/interior area;
- no deliberate capture of worshippers as the subject.

The exact section should be chosen on site based on:

- crowd density;
- occlusion;
- stable lighting;
- ability to walk a safe repeatable path;
- lack of temporary stalls/vehicles blocking the subject.

### Do not attempt in the first proof

- full 360° plaza;
- upper spire coverage;
- aerial orbit;
- interiors;
- night capture;
- festival/ceremony capture;
- multiple large disconnected sections.

---

## Capture conditions

Prefer:

- early morning / lower foot traffic;
- stable soft daylight;
- dry weather;
- minimal wind;
- a period without major ceremonies/events;
- one capture session rather than mixing very different lighting.

Avoid:

- strong changing shadows;
- rain;
- heavy wind moving flags/cloth;
- dense crowds;
- repeatedly switching camera lenses;
- digital zoom;
- portrait/bokeh modes;
- beauty filters or computational effects that change geometry.

---

## Camera strategy

### Preferred source: still photos

For the first partial proof, prefer still photos over extracting every frame from a long video.

Target:

- **120–180 usable photos**;
- one consistent rear camera;
- default/main lens (typically 1×);
- full-resolution JPEG/HEIC converted losslessly if necessary;
- no digital zoom;
- no lens switching mid-pass.

If the camera app supports it:

- lock exposure;
- lock focus once the subject distance is appropriate;
- lock white balance;
- keep ISO low enough to avoid noisy texture.

Video can be recorded as a backup capture, but the still set should remain the controlled source.

### Overlap

Aim for roughly:

- 70–85% overlap between adjacent views;
- visible features carried across several consecutive images;
- slow positional changes rather than large jumps.

Do not simply stand in one position and rotate the phone. Reconstruction needs camera **translation/parallax**, not only panorama rotation.

---

## Capture passes

For the partial section:

### Pass A — normal eye height

Walk a slow arc/path across the target section.

- camera approximately level;
- consistent distance where possible;
- subject fills most of the frame without clipping.

### Pass B — lower angle

Repeat the path roughly 0.5–1 m lower.

Purpose:

- reveal geometry occluded from eye level;
- strengthen depth/parallax.

### Pass C — higher angle

Repeat from safe arm-height / permitted elevated ground position.

Do not climb structures or cross barriers.

### Detail inserts

After the broad passes, add a small number of closer images for important static texture/geometry that remained soft.

Do not let detail photos replace broad overlapping coverage.

---

## Moving-scene risks

Boudhanath is not a controlled studio.

Likely reconstruction problems:

- people crossing the same surface;
- moving prayer flags;
- pigeons;
- vehicles;
- changing shadows;
- reflective windows;
- repeated architectural patterns;
- temporary objects.

Mitigation:

- use multiple passes;
- pause when large groups cross the subject;
- keep the architectural structure visible in most frames;
- remove obvious floaters/people during cleanup;
- never publish a raw capture just because reconstruction finished successfully.

---

## Privacy rules

Before any public artifact:

- inspect recognizable faces;
- inspect children carefully;
- inspect vehicle plates;
- inspect private documents/screens/signage;
- inspect reflections;
- inspect reconstructed people frozen into the splat.

Raw imagery stays private unless there is a clear reason and permission to publish it.

The public experience should prioritize the heritage structure, not identifiable bystanders.

---

## First reconstruction toolchain

### Capture

Phone still photos, with optional backup MP4.

### Cloud reconstruction

**Polycam Gaussian Splat** is the Phase 3 first-choice processing service because it currently supports photo/video input and Gaussian Splat outputs including PLY.

References:

- https://poly.cam/tools/gaussian-splatting
- https://poly.cam/docs/api

Account/plan limits can change. Verify export availability before the real capture day.

### Cleanup

Use **SuperSplat Editor** for the first partial splat:

- crop irrelevant space;
- delete floaters;
- remove reconstructed people where practical;
- align/scale if needed;
- export cleaned PLY.

References:

- https://developer.playcanvas.com/user-manual/supersplat/editor/
- https://developer.playcanvas.com/user-manual/supersplat/editor/import-export/

For a large final capture, cleanup may require stronger hardware or a different workflow. Phase 3 only needs the partial proof.

### Browser delivery

Cleaned PLY is converted into Spark's prebuilt LOD/RAD delivery path.

Spark reference:

https://sparkjs.dev/docs/lod-getting-started/

The conversion automation belongs to Phase 3B.

---

## Raw-data handling

Keep these outside Git:

```text
local-assets/
├── captures/
│   └── <capture-id>/
│       ├── raw/
│       ├── source-export/
│       ├── cleanup/
│       └── delivery/
└── manifests/
```

Recommended naming:

```text
boudha-partial-<zone>-YYYYMMDD-r01
```

Example:

```text
boudha-partial-west-20261005-r01
```

Never use vague names such as:

```text
final.ply
final2.ply
new-final.ply
```

---

## Capture-day acceptance checklist

Do not leave the site until you have checked:

- [ ] intended section has full broad coverage;
- [ ] at least three overlapping height/angle passes;
- [ ] no major gap caused by crowd/temporary obstruction;
- [ ] first and last images are sharp;
- [ ] random middle images are sharp;
- [ ] no accidental lens switch;
- [ ] exposure did not change dramatically;
- [ ] raw count is within processing limits;
- [ ] backup copy exists;
- [ ] capture manifest has date/device/site/permission notes;
- [ ] no aerial imagery was captured without the required approvals.

---

## Success criteria for the partial proof

The partial capture is accepted only when:

1. the architecture is spatially convincing from several nearby viewpoints;
2. there are no large holes in the intended subject area;
3. moving-person artifacts are cleaned to an acceptable level;
4. a cleaned PLY is exported;
5. source/provenance information is recorded;
6. the asset is converted to RAD;
7. the browser loads the partial scene progressively;
8. we can measure first-visible scene, memory pressure, and real-device interaction.

A visually impressive but legally/provenance-unclear capture does **not** pass Phase 3.
