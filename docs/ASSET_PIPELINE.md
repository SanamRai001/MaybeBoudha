# Reconstruction Asset Pipeline

## Goal

Keep capture data, editable reconstruction data, and browser-delivery data separate.

The browser artifact must never become the only surviving master copy.

## Pipeline

```text
RAW CAPTURE
photos / optional video
        ↓
CLOUD RECONSTRUCTION
Gaussian Splat
        ↓
SOURCE EXPORT
raw splat PLY
        ↓
CLEANUP
SuperSplat / approved editor
        ↓
MASTER
cleaned PLY
        ↓
LOD BUILD
Spark quality build-lod
        ↓
DELIVERY
paged RAD + RADC chunks
        ↓
OBJECT STORAGE / CDN
        ↓
MaybeBoudha
```

## Artifact roles

### 1. Raw capture

Examples:

- JPG/HEIC/PNG;
- optional MP4;
- capture notes.

Properties:

- private by default;
- immutable after backup;
- never committed to Git;
- checksum recorded.

### 2. Source reconstruction export

The direct Gaussian Splat export from the reconstruction service.

Expected first format:

`PLY`

Keep it even when cleanup later creates a better master.

### 3. Cleaned master

The cleaned, privacy-reviewed reconstruction.

Expected format:

`PLY`

This is the renderer-independent working master.

Operations that should happen before promoting an asset to master:

- crop unused space;
- delete floaters;
- remove obvious frozen people/private details;
- inspect holes;
- normalize orientation;
- record scale if known;
- record editor/tool version.

### 4. Delivery build

Expected production format:

```text
scene.rad
scene-0.radc
scene-1.radc
...
```

Generated from the cleaned PLY using Spark's LOD tooling.

The delivery build is disposable/rebuildable.

Do not manually edit RAD/RADC output.

---

## Spark LOD direction

Spark recommends prebuilding LOD for faster loading/streaming.

Phase 3B verified the pipeline against Spark **2.2.0** pinned to:

`4eb719afdb5b3655fe0bc290588e4728d9772405`

The reproducible asset job uses:

```bash
cargo run \
  --locked \
  --manifest-path rust/build-lod/Cargo.toml \
  --release \
  --no-default-features \
  -- \
  --quality \
  --rad-chunked \
  <source.ply>
```

The pinned Spark lockfile requires Rust **1.88.0** in practice. Earlier 1.82/1.85 attempts failed on locked transitive dependency requirements.

Reference:

https://sparkjs.dev/docs/lod-getting-started/

Do not install Rust or compile the LOD tool on every application build.

Preferred production pattern:

```text
asset-processing job
        ↓
RAD output
        ↓
publish immutable scene version
        ↓
normal web app deploy only references version
```

---

## Storage layout

Local working layout:

```text
local-assets/
└── captures/
    └── <capture-id>/
        ├── raw/
        ├── source-export/
        │   └── source.ply
        ├── cleanup/
        │   └── master.ply
        ├── delivery/
        │   ├── scene.rad
        │   └── *.radc
        └── manifest.json
```

Production object storage:

```text
scenes/
└── boudha/
    └── <scene-version>/
        ├── scene.rad
        └── *.radc
```

Example immutable version:

```text
scenes/boudha/2026-10-05-r01/
```

Do not overwrite an existing published scene version.

---

## CDN/object-storage requirements

Required before Phase 4:

- HTTPS;
- CORS configured for the web application;
- byte-range requests;
- immutable cache headers for versioned scene files;
- correct MIME handling or safe binary fallback;
- no authentication mechanism that prevents normal range fetching;
- predictable relative URLs between RAD header/chunks.

---

## Promotion gates

### Raw → source reconstruction

Require:

- capture manifest exists;
- raw backup exists;
- source set is complete.

### Source reconstruction → cleaned master

Require:

- visual inspection;
- privacy review;
- crop/noise cleanup;
- orientation recorded;
- provenance retained.

### Cleaned master → delivery

Require:

- master checksum recorded;
- RAD build command/version recorded;
- output file count/size recorded.

### Delivery → public

Require:

- browser smoke test;
- physical desktop test;
- physical mobile test;
- privacy check repeated on rendered result;
- source rights/consent status allows publication.

---

## Versioning

Every meaningful reconstruction change creates a new scene version.

Do not use app Git commit hashes as the only asset version identifier.

Recommended:

```text
<date>-r<revision>
```

Example:

```text
2026-10-05-r03
```

The manifest should also record:

- app commit used for validation;
- master PLY checksum;
- RAD builder version/commit;
- published object-storage prefix.

---

## Phase 3B verified

The pinned fixture proof completed:

- source: 2,487,573-byte compressed PLY;
- source splats: 152,746;
- final quality-LOD splats: 202,475;
- output: 1 RAD header + 4 RADC chunks;
- total delivery: 4,033,648 bytes;
- byte-range response: 206;
- generated RAD: visibly rendered with `paged: true`.

See `RAD_PIPELINE_PROOF.md` for exact hashes and evidence.

The next real use of this pipeline should be against the privacy-reviewed partial Boudhanath master from Phase 3D, not against unreviewed raw capture output.
