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

**Phase 3A — Capture governance and field plan**

Status: **complete and merged**

PR:

`#3 — docs: Phase 3A Boudhanath capture governance`

Merge SHA:

`2a0c873d7b2c1019cad82b9cb80510dfec3e90ac`

Pre-merge CI:

`#60 — fully green`

Verified:

- locked dependency install;
- tests;
- production build;
- Spark runtime probe;
- PlayCanvas runtime probe.

## Phase 3A delivered

- `docs/CAPTURE_PLAN.md`;
- `docs/ASSET_PIPELINE.md`;
- `docs/CAPTURE_PROVENANCE_TEMPLATE.md`;
- raw/processed capture Git exclusions;
- ground-first capture policy;
- site/heritage/drone permission guardrails;
- privacy/provenance requirements;
- Polycam → PLY → SuperSplat → cleaned PLY workflow;
- Phase 3A–3D boundaries.

## Capture decisions

### Baseline

**Ground-only by default.**

Aerial capture is not assumed and requires a separately verified permission path.

### First real capture

Do not scan the whole Stupa first.

Capture one small, ground-accessible, mostly static exterior section using controlled overlapping photo passes.

### Raw data

Private by default and kept outside normal Git history.

### First reconstruction workflow

```text
phone photos
    ↓
Polycam Gaussian Splat
    ↓
source PLY
    ↓
SuperSplat cleanup
    ↓
cleaned master PLY
    ↓
Spark LOD/RAD processing
```

## Accepted rendering architecture

From ADR-001:

- Spark 2.2.x;
- direct Three.js/Spark runtime;
- PLY as reconstruction interchange/master direction;
- paged RAD for production delivery;
- PlayCanvas as fallback candidate.

## Current phase

**Phase 3 — Boudhanath Capture / Asset Plan**

### Current subphase

**Phase 3B — PLY → RAD processing proof**

Status: **not started**

## Phase 3B goal

Before any Boudhanath field capture, prove that a legal PLY can be converted reproducibly into Spark's paged RAD delivery and loaded in the browser.

Deliver:

1. pin the Spark LOD builder source/version;
2. create a separate asset-processing workflow;
3. run the builder against a legal small PLY fixture;
4. use quality LOD + chunked RAD;
5. record source/output checksums, file sizes, chunk count, and builder metadata;
6. serve the generated RAD/RADC files locally in CI;
7. load the generated RAD through Spark with `paged: true`;
8. add a deterministic runtime proof;
9. document the exact process.

## Spark builder facts verified before Phase 3B

Spark v2.2.0 defines:

```text
npm run build-lod -- <args>
```

which invokes:

```text
cargo run --manifest-path rust/build-lod/Cargo.toml --release --
```

The workspace requires Rust **1.82**.

The builder accepts PLY/compressed PLY and supports:

- `--quality`;
- `--rad-chunked`;
- input validation;
- optional crop/filter/SH controls.

Phase 3B should pin the Spark source tag/commit rather than depending on a moving branch.

## Phase 3B constraint

Do not install/compile the Rust LOD builder during every ordinary application CI/build.

Asset processing must be isolated from the normal app pipeline.

## Blocker for Phase 3C

Do not begin a real Boudhanath capture until:

- Phase 3B is green;
- current on-site/systematic-capture rules are reconfirmed;
- intended permission/provenance fields can be completed honestly.

## Known risks

- Rust LOD build cost;
- RAD chunk hosting/range behavior;
- relative chunk URLs;
- full-site asset size;
- mobile memory pressure;
- source PLY quality varying by reconstruction service;
- physical capture permissions and crowd/privacy constraints.

## Next branch

`feat/phase-3b-rad-pipeline`

## Resume rule

1. verify actual `main` and CI;
2. read ADR-001 and ASSET_PIPELINE;
3. repository state wins over docs if they differ;
4. create Phase 3B from verified main;
5. keep asset processing separate from normal application CI;
6. update this file at the Phase 3B boundary.
