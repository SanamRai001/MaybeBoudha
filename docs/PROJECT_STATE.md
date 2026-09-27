# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa, using a legitimate real-scene reconstruction and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3c-partial-boudhanath-capture`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3B — PLY → paged RAD processing proof**

Merged in PR #4:

`80604179ebe2c3499dffcbf894e070fdc533d28f`

Verified:

- PR head: CI #80 + RAD Pipeline #16
- merged main: CI #81 + RAD Pipeline #17
- final Phase 3B main checkpoint: `433a727f6d954a57ed18982af445cbd26e226eef`
- checkpoint CI #85: green

Phase 3B proved:

```text
pinned PLY
    ↓
Spark quality LOD
    ↓
chunked RAD
    ↓
HTTP range delivery
    ↓
paged Spark runtime
```

See `docs/RAD_PIPELINE_PROOF.md`.

## Current phase

**Phase 3C — Partial Boudhanath Capture**

### Current subphase

**Phase 3C.1 — Field readiness / permission gate**

Status: **remote implementation complete on branch; verification pending**

## Phase 3C.1 current-source findings

Checked on **2026-09-27**.

### Heritage status

Boudhanath is a Monument Zone of the Kathmandu Valley UNESCO World Heritage property and is nationally protected.

### Department of Archaeology

Current official DoA material:

- lists photography/documentation work for historical and archaeological monuments;
- lists consent for filming at ancient monuments;
- says its Photography Unit grants filming permission under applicable rules inside protected monument areas.

The sources do not explicitly classify Gaussian Splatting / photogrammetry.

Therefore a systematic 120–180 image capture for a derived public 3D reconstruction is treated as **permission-determination required**, not assumed casual photography.

### Local site authority

The Shree Boudhanath Area Development Committee is the current local Boudhanath body.

Current public contact:

- phone: `01-4589257`
- email: `info@boudhanath.gov.np`

No dedicated current public form for photogrammetry / Gaussian Splat capture was found.

### Drone

**No drone in Phase 3C.**

CAAN's published standard UAS conditions prohibit operation over populated areas. Boudhanath's first proof remains ground-only.

## Phase 3C.1 delivered

- `docs/PHASE_3C_FIELD_READINESS.md`
- `docs/CAPTURE_PERMISSION_REQUEST_TEMPLATE.md`
- exact project/capture description for authorities;
- DoA questions;
- Boudhanath committee questions;
- evidence rules;
- capture-day readiness pack;
- explicit GO / NO-GO gate.

## Next subphase

**Phase 3C.2 — Field clearance**

Status: **blocked on external written determinations**

Before any systematic field capture, obtain and privately retain:

1. DoA written determination for the described ground-based systematic capture;
2. Boudhanath Area Development Committee written determination;
3. required approval/fee/process evidence, if applicable;
4. allowed scope and publication conditions.

A written statement that no prior permission is required also satisfies the determination requirement if it clearly covers the described activity.

## Field capture remains not started

No Boudhanath source-photo dataset or real reconstruction exists in the repository.

Do not:

- claim permission was obtained;
- capture a systematic dataset before the gate clears;
- substitute scraped/web imagery;
- use a drone;
- attempt the full monument/plaza.

## After clearance

Phase 3C.3 only:

```text
small legitimate ground capture
        ↓
private raw archive + provenance
        ↓
cloud Gaussian Splat reconstruction
        ↓
source PLY
```

Cleanup/privacy master promotion and real-asset RAD/device proof remain Phase 3D.

## Known risks

- the authorities may require a formal application or fee;
- approved scope may differ from the current proposal;
- crowds/ceremonies can make a permitted day a practical no-go;
- moving prayer flags and people can hurt reconstruction;
- upper monument coverage remains limited from the ground;
- cloud export capabilities can change.

## Resume rule

1. inspect branch/PR/CI;
2. read `PHASE_3C_FIELD_READINESS.md`;
3. repository state wins over documentation if they differ;
4. do not advance to field capture until written determinations are available;
5. once received, record only non-sensitive references in the public repo and keep private correspondence private;
6. update this file at every subphase boundary.
