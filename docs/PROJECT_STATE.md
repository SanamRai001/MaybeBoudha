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

**Phase 3B — PLY → paged RAD processing proof**

Status: **complete and merged**

PR:

`#4 — feat: Phase 3B paged RAD processing proof`

Merge SHA:

`80604179ebe2c3499dffcbf894e070fdc533d28f`

### Final PR-head verification

Documentation-complete head:

`85e6abccfa7abdb327258634f2e524f28423211d`

Passed:

- normal CI **#80**
- RAD Pipeline **#16**

### Post-merge main verification

The actual merge SHA passed:

- normal CI **#81**
- RAD Pipeline **#17**

Verified on merged `main`:

- locked install;
- tests;
- production build;
- Spark runtime probe;
- PlayCanvas runtime probe;
- pinned Spark/Rust asset conversion;
- quality Bhatt LOD;
- chunked RAD/RADC generation;
- per-build manifest generation;
- HTTP 206 byte-range delivery;
- paged Spark runtime with non-zero streamed splats;
- Chromium RAD rendering proof.

## Phase 3B evidence

Detailed report:

`docs/RAD_PIPELINE_PROOF.md`

### Source fixture

- repository: `playcanvas/engine`
- commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`
- source: `biker.compressed.ply`
- bytes: **2,487,573**
- source splats: **152,746**
- SHA-256: `ad906646017096ef6613cdbd1e575104e90403dc79116a9c6af749433ca1e8a1`

### Asset builder

- Spark: **2.2.0**
- commit: `4eb719afdb5b3655fe0bc290588e4728d9772405`
- practical pinned Rust toolchain: **1.88.0**
- method: `BhattLod { lod_base: 1.75 }`
- delivery: `--rad-chunked`

### Output

- quality-LOD splats: **202,475**
- RAD header: **1,744 bytes**
- RADC chunks: **4**
- total delivery: **4,033,648 bytes**
- range support: **verified 206 Partial Content**
- generated paged RAD visible in Chromium: **verified**

### Reproducibility finding

The source, Spark commit, Rust toolchain, and build options are pinned.

The four RADC chunk hashes remained stable across successful runs, but Spark embeds per-run timing metadata in the small RAD header comment, so the RAD header is **not bit-for-bit stable**. Every asset build therefore records the exact output hashes in its manifest.

Use immutable scene version + manifest as the release identity.

## Accepted rendering/delivery architecture

```text
approved cleaned PLY
        ↓
Spark quality LOD asset job
        ↓
chunked RAD
        ↓
range-capable object storage/CDN
        ↓
Spark paged runtime
```

Normal application CI remains Node/web-only. The Rust asset builder stays in the separate RAD Pipeline.

PlayCanvas remains the fallback renderer candidate if the real Boudhanath workload exposes a material Spark limitation.

## Current subphase

**Phase 3C — Partial Boudhanath Capture**

Status: **not started**

## Phase 3C prerequisite

Do not begin systematic field capture until the current requirements for the intended capture method are reconfirmed.

Required before capture:

1. verify current site-management / heritage rules;
2. determine whether written permission or prior consent is required;
3. record permission/reference information honestly in the provenance record;
4. select one small ground-accessible, mostly static exterior section;
5. use the ground-first capture method from `docs/CAPTURE_PLAN.md`;
6. keep raw imagery private by default.

No Boudhanath field imagery currently exists in the repository, and none is claimed as captured.

## Phase 3C target

Produce only:

```text
legitimate partial field capture
        ↓
cloud Gaussian Splat reconstruction
        ↓
source PLY
```

Cleanup, privacy-reviewed master promotion, RAD conversion of the real asset, and physical-device validation belong to **Phase 3D**.

## Still unverified

Do not claim these are solved:

- capture permission for a specific session;
- actual partial Boudhanath reconstruction quality;
- upper-monument coverage;
- full monument/plaza scene size;
- physical desktop/mobile FPS;
- physical mobile memory;
- real CDN/cache behavior;
- privacy cleanup of actual captured bystanders.

## Next branch

After this main checkpoint verifies:

`feat/phase-3c-partial-boudhanath-capture`

## Known risks

- systematic capture may require site/heritage consent;
- crowds and moving prayer flags can corrupt reconstruction;
- changing light and occlusion can reduce quality;
- upper monument coverage is limited from the ground;
- a real reconstruction may differ substantially from the engineering fixture;
- privacy review is required before any public reconstruction.

## Resume rule

1. inspect actual `main` and CI;
2. read `CAPTURE_PLAN.md`, `CAPTURE_PROVENANCE_TEMPLATE.md`, and `RAD_PIPELINE_PROOF.md`;
3. repository state wins if documentation differs;
4. reconfirm current capture requirements before field work;
5. do not invent or substitute web imagery for a legitimate project capture;
6. update this file at every subphase boundary.
