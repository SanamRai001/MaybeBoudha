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

Phase 3B should automate a command equivalent to:

```bash
npm run build-lod -- scene.ply --quality --rad-chunked
```

The Spark tool itself currently requires Rust when built/run from the Spark source tree.

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

## Phase 3B

Next engineering step:

1. create a reproducible PLY → RAD processing command/job;
2. test it against a legal small fixture;
3. load the generated RAD in Spark using `paged: true`;
4. record output size/chunk count;
5. only then run it against the real partial Boudhanath master.
