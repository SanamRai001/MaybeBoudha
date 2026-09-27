# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa, using a legitimate real-scene reconstruction and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3C.1 — Field readiness / permission gate**

Status: **complete and merged**

PR:

`#5 — docs: Phase 3C.1 Boudhanath field readiness gate`

Merge SHA:

`be1369876adde2f87c814df8bafb98839f40505e`

Merged-main verification:

`CI #87 — green`

Phase 3C.1 delivered:

- current official heritage/site/drone source review;
- Department of Archaeology responsibility/permission questions;
- current Shree Boudhanath Area Development Committee contact;
- exact systematic-capture description;
- written evidence requirements;
- explicit GO / NO-GO rule;
- capture-day readiness pack;
- `docs/PHASE_3C_FIELD_READINESS.md`;
- `docs/CAPTURE_PERMISSION_REQUEST_TEMPLATE.md`.

## Previous completed subphase

**Phase 3B — PLY → paged RAD processing proof**

Merged in PR #4:

`80604179ebe2c3499dffcbf894e070fdc533d28f`

Final Phase 3B main checkpoint:

`433a727f6d954a57ed18982af445cbd26e226eef`

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

**Phase 3 — Boudhanath Capture / Asset Plan**

### Current subphase

**Phase 3C.2 — Field clearance**

Status: **blocked on external written determinations**

This is an intentional external gate, not unfinished repository implementation.

## Required clearance evidence

Before any systematic field capture, obtain and privately retain:

1. Department of Archaeology written determination for the exact proposed ground-based systematic photography / derived 3D reconstruction;
2. Shree Boudhanath Area Development Committee written determination for its site requirements;
3. any required application, fee, schedule, or conditions;
4. confirmation that the intended derived 3D/publication scope is allowed;
5. any date/time or equipment restrictions.

A clear written determination that no prior permission is required also satisfies the relevant gate if it explicitly covers the described activity.

## Current-source findings

Reviewed on **2026-09-27**:

- Boudhanath is within the protected Kathmandu Valley World Heritage property;
- DoA publishes photography/documentation and ancient-monument filming/permission responsibilities;
- no official source found explicitly classifies Gaussian Splatting / photogrammetry;
- the current local site body is the Shree Boudhanath Area Development Committee;
- no public dedicated Gaussian-Splat/photogrammetry permit form was found;
- Phase 3C remains **ground-only**;
- no drone operation is part of the current capture plan.

Detailed sources/questions:

`docs/PHASE_3C_FIELD_READINESS.md`

## Field capture remains not started

No real Boudhanath source-photo dataset or Boudhanath reconstruction exists in the repository.

Do not:

- claim permission has been obtained;
- capture the systematic dataset before written determinations clear the gate;
- substitute scraped/web imagery;
- use a drone;
- attempt the full monument/plaza.

## Next executable subphase after clearance

**Phase 3C.3 — Partial field capture and source reconstruction**

Only after Phase 3C.2 clears:

```text
one small legitimate ground-accessible capture
        ↓
private raw archive + provenance
        ↓
cloud Gaussian Splat reconstruction
        ↓
source PLY
```

Phase 3D remains responsible for:

- cleanup;
- privacy review;
- cleaned master PLY;
- real-asset RAD build;
- browser proof;
- physical desktop/mobile measurements.

## External action package already prepared

Use:

- `docs/CAPTURE_PERMISSION_REQUEST_TEMPLATE.md`
- `docs/PHASE_3C_FIELD_READINESS.md`
- `docs/CAPTURE_PROVENANCE_TEMPLATE.md`

Do not commit private authority correspondence to this public repository.

Record only non-sensitive references/status in the public project state after replies are received.

## Known risks

- authorities may require a formal application or fee;
- approved scope may differ from the current proposal;
- a verbal response may be insufficient for the project evidence rule;
- crowds/ceremonies can still make an approved day a practical NO-GO;
- moving prayer flags and people can degrade reconstruction;
- upper monument coverage remains limited from ground positions;
- cloud reconstruction/export capabilities can change.

## Branch hygiene

Merged feature branches currently remain in the repository. Do not delete them automatically.

A later cleanup pass may remove merged/stale branches after explicit approval.

## Resume rule

1. inspect actual `main` and CI;
2. read `PHASE_3C_FIELD_READINESS.md`;
3. repository state wins over documentation if they differ;
4. do not advance to field capture until both written determinations are available;
5. once received, keep private correspondence private and record only non-sensitive references/status publicly;
6. update this file at every subphase boundary.
