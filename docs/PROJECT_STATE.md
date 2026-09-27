# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa, using a legitimate real-scene reconstruction and progressive browser delivery.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3b-rad-pipeline`
- Pull request: `#4 — feat: Phase 3B paged RAD processing proof`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3A — Capture governance and field plan**

Status: **complete and merged**

Merge SHA:

`2a0c873d7b2c1019cad82b9cb80510dfec3e90ac`

Final merged-main checkpoint before Phase 3B:

`0d9bc4dc90bbf0fe9e1618a7b6c6ad501c477be7`

Main CI #64 passed:

- locked install;
- tests;
- production build;
- Spark runtime probe;
- PlayCanvas runtime probe.

## Current subphase

**Phase 3B — PLY → paged RAD processing proof**

Status: **implementation/proof complete on branch; final branch verification pending**

## Phase 3B delivered

- separate `RAD Pipeline` workflow;
- pinned legal compressed-PLY input;
- pinned Spark v2.2.0 builder source;
- pinned practical Rust toolchain;
- quality LOD build;
- chunked RAD/RADC output;
- per-build manifest with hashes/sizes;
- range-capable proof server;
- explicit 206 byte-range gate;
- `?renderer=rad` application mode;
- Spark `paged: true` runtime;
- paged-ready condition that requires RAD metadata + non-zero streamed splats;
- Chromium screenshot proof.

Detailed evidence:

`docs/RAD_PIPELINE_PROOF.md`

## Successful engineering proof

First successful dedicated proof:

- `RAD Pipeline #4`
- run ID: `36297745202`
- head: `75ae85abefb7b2f16db2559c0764ba65a2d0cc51`

Later implementation-complete verification before the final documentation checkpoint:

- normal CI **#75** — green;
- RAD Pipeline **#11** — green;
- head: `f531d4c2d354906c97ad9861ab2510c72ec8177c`.

RAD #11 included conversion, manifest generation, staged-manifest artifact packaging, byte-range delivery, and paged Chromium rendering.

### Source

- repository: `playcanvas/engine`
- commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`
- file: `biker.compressed.ply`
- bytes: **2,487,573**
- source splats: **152,746**
- SHA-256: `ad906646017096ef6613cdbd1e575104e90403dc79116a9c6af749433ca1e8a1`

### Builder

- Spark: **2.2.0**
- source commit: `4eb719afdb5b3655fe0bc290588e4728d9772405`
- actual working Rust toolchain: **1.88.0**
- LOD method: `BhattLod { lod_base: 1.75 }`
- output: `--rad-chunked`

### Toolchain finding

The upstream workspace declaration of Rust 1.82 is not sufficient for the pinned v2.2.0 dependency lock:

- Cargo 1.82 could not parse an Edition 2024 dependency;
- Rust 1.85 then failed because `image@0.25.10` requires 1.88;
- Rust **1.88.0** completed the pinned build.

Repository docs must use the observed working toolchain for this pipeline.

### Output

- final LOD splats: **202,475**
- RAD header: **1,744 bytes**
- RADC chunks: **4**
- total delivery: **4,033,648 bytes**
- byte-range response: **206**
- generated RAD visibly rendered: **yes**

Hosted-runner LOD/runtime timing is recorded only as engineering evidence, not a production performance claim.

### Reproducibility finding

The asset-processing **inputs, builder commit, toolchain, and options are pinned**, but the generated RAD header is not bit-for-bit stable.

Across successful runs:

- all RADC chunk SHA-256 hashes remained stable;
- the RAD header hash changed because Spark embeds per-run timing metadata in its header comment.

Every asset build therefore records the exact produced hashes in its manifest. Immutable scene version + manifest is the release identity; a repeated build is not assumed to have the same RAD-header hash.

## Accepted architecture

Still unchanged from ADR-001:

```text
approved cleaned PLY
        ↓
Spark quality LOD build
        ↓
chunked RAD
        ↓
range-capable object storage/CDN
        ↓
Spark paged runtime
```

PlayCanvas remains the fallback renderer candidate.

## CI architecture

### Normal app CI

Remains Node/web-only:

- locked install;
- tests;
- production build;
- existing Spark/PlayCanvas runtime smoke.

It does **not** compile the Rust asset builder.

### RAD Pipeline

Runs separately when asset-pipeline/runtime proof files change or when manually dispatched.

It owns:

- Rust;
- Spark builder source;
- fixture download;
- RAD generation;
- manifest;
- range server;
- RAD browser proof.

## Still unverified

Do not claim these are solved:

- real Boudhanath reconstruction quality;
- capture permission for a specific field session;
- upper-monument coverage;
- full plaza delivery size;
- physical desktop/mobile FPS;
- physical mobile memory pressure;
- real CDN/cache behavior;
- privacy cleanup of an actual capture.

## Next subphase after merge

**Phase 3C — Partial Boudhanath Capture**

Before capture:

1. reconfirm current on-site/systematic-capture rules;
2. determine whether written site/heritage consent is required;
3. choose one small ground-accessible section;
4. create the real capture provenance record;
5. keep raw imagery private;
6. reconstruct/export the source PLY only after the capture is legitimate.

Do not attempt the full monument/plaza in Phase 3C.

## Known risks

- real-source PLY characteristics may differ from the small fixture;
- quality LOD can make delivery larger than the original PLY;
- full-site chunk count may be large;
- range/CDN configuration must remain correct in production;
- mobile memory still requires physical-device measurement;
- capture crowds/flags/light can degrade reconstruction;
- permissions must be checked for the actual capture method/date.

## Resume rule

1. inspect PR #4 head and both workflow results;
2. read ADR-001, ASSET_PIPELINE, and RAD_PIPELINE_PROOF;
3. repository state wins over docs if they differ;
4. merge only after normal CI and RAD Pipeline are green on the documentation-complete head;
5. post-merge, checkpoint the actual merge SHA on `main`;
6. only then create the Phase 3C branch.
