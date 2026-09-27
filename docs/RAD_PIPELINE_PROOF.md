# Phase 3B — PLY → Paged RAD Pipeline Proof

## Purpose

Phase 3B proves the selected reconstruction delivery path **before** any Boudhanath field capture:

```text
portable Gaussian Splat PLY
        ↓
Spark quality LOD build
        ↓
chunked RAD + RADC
        ↓
HTTP byte-range delivery
        ↓
Spark paged runtime
        ↓
visible browser reconstruction
```

This is an engineering proof with a pinned public test fixture. It is not a Boudhanath asset and it is not a production performance benchmark.

## Verified proof run

First successful dedicated proof:

- workflow: `RAD Pipeline`
- run: **#4**
- run ID: `36297745202`
- branch head: `75ae85abefb7b2f16db2559c0764ba65a2d0cc51`

Later verification completed the proof:

- implementation-complete pre-doc head: normal CI **#75**, RAD Pipeline **#11**
- documentation-complete PR head `85e6abccfa7abdb327258634f2e524f28423211d`: normal CI **#80**, RAD Pipeline **#16**
- merged main `80604179ebe2c3499dffcbf894e070fdc533d28f`: normal CI **#81**, RAD Pipeline **#17**

The merged-main RAD run regenerated the scene, build manifest, range-delivery proof, and paged Chromium render successfully.

## Input fixture

Pinned legal/public engineering fixture:

- repository: `playcanvas/engine`
- commit: `b5b983982a9860d21e0c1dafb2f85f72e2c01afb`
- file: `examples/assets/splats/biker.compressed.ply`
- bytes: **2,487,573**
- decoded source splats: **152,746**
- SH degree: **0**
- SHA-256: `ad906646017096ef6613cdbd1e575104e90403dc79116a9c6af749433ca1e8a1`

## Pinned builder

- repository: `sparkjsdev/spark`
- Spark version: **2.2.0**
- commit: `4eb719afdb5b3655fe0bc290588e4728d9772405`
- practical Rust toolchain for the pinned lockfile: **1.88.0**

### Rust-version finding

Spark v2.2.0's workspace metadata declares a lower Rust version, but the pinned dependency graph could not actually be built with that value.

Observed in CI:

1. Rust/Cargo 1.82 could not parse an Edition 2024 dependency manifest.
2. Rust 1.85 progressed further but `image@0.25.10` required Rust 1.88.
3. Rust **1.88.0** built the pinned Spark source and completed the RAD conversion.

Therefore MaybeBoudha pins the **observed working toolchain**, not the lower upstream workspace declaration.

## Build command

The isolated asset-processing workflow runs Spark's Rust builder directly:

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

Why `--no-default-features` is used at the `build-lod` package level:

- the Phase 3B conversion does not need the optional GPU SH-clustering path;
- keeping that feature set out of this proof reduces unnecessary asset-job dependencies;
- the actual LOD quality method remains Spark's Bhattacharyya-based quality LOD.

## LOD result

Builder output reported:

- method: `BhattLod { lod_base: 1.75 }`
- input splats: **152,746**
- final LOD splats: **202,475**
- hosted-runner LOD computation: ~**4.05 s**
- hosted-runner chunk-tree step: ~**0.052 s**

The timing values are CI implementation evidence only, not production performance targets.

The final splat count is larger than the source count because the prebuilt LOD tree contains hierarchy/representation data needed for progressive detail selection.

## Generated delivery files

Total generated RAD delivery:

- files: **5**
- RADC chunks: **4**
- total bytes: **4,033,648**

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `biker.compressed-lod.rad` | 1,744 | per-build; run #11: `40aebf5d9aa739037eda9a143d1664c47f3b31ad8c15bb81b5c4fc982ee4d22d` |
| `biker.compressed-lod-0.radc` | 1,355,200 | `b3ad23311dc4a9457cf6b5c7ae5de864e7ecc3c2e8658ad7cb383376c16e2593` |
| `biker.compressed-lod-1.radc` | 1,281,456 | `80bfaf10a1e90c7f3a9cfcaaeccc913edb5b87a7b9dccffcbdddb1977dfac08e` |
| `biker.compressed-lod-2.radc` | 1,284,432 | `88732e968a704e463387d27e3e77c1f4cf1e1e07b97a60f5742454a36f1b933a` |
| `biker.compressed-lod-3.radc` | 110,816 | `65f9c53972df9c2763249f0e20f268edeb340152ecac59d4f74ee4e0f9e1a641` |

The RAD delivery is intentionally rebuildable and should not replace the cleaned source/master PLY.

### Bitwise reproducibility

The conversion process is pinned and repeatable, but Spark v2.2.0's generated `.rad` header is **not bit-for-bit deterministic**.

Observed across successful runs:

- all four `.radc` chunk hashes remained identical;
- the `.rad` header hash changed;
- run #4 header SHA-256: `a9f72eceee5ba7dd28c4a01d1c60cdfee56da49c92fbe7dccbd66139c5b64bac`;
- run #11 header SHA-256: `40aebf5d9aa739037eda9a143d1664c47f3b31ad8c15bb81b5c4fc982ee4d22d`.

Spark's builder embeds per-run values such as `lod_duration` and `chunk_duration` in the RAD header comment. That metadata changes even when the source, builder commit, options, and RADC payloads are unchanged.

Therefore:

- the workflow pins the **process and inputs**;
- every build manifest records the exact output hashes produced by that run;
- scene releases should use immutable scene versions plus their manifest;
- MaybeBoudha does not claim bit-identical RAD headers across rebuilds.

## Manifest

`scripts/rad/create-manifest.mjs` creates a per-build manifest that records:

- pinned source identity;
- source byte count and SHA-256;
- Spark builder repository/commit/version;
- Rust toolchain;
- build command/method/output mode;
- output file count;
- chunk count;
- total output bytes;
- per-file byte counts and SHA-256 hashes.

The workflow stages this as:

```text
dist/rad/manifest.json
```

and includes it in the proof artifact.

## HTTP delivery proof

The Phase 3B server supports:

- `Accept-Ranges: bytes`
- CORS
- binary RAD/RADC responses
- SPA fallback only for application routes, never for missing scene chunks

The workflow explicitly requested:

```http
Range: bytes=0-63
```

and required:

- HTTP **206 Partial Content**
- `Accept-Ranges: bytes`
- exactly **64 response bytes**

This matters because paged RAD must be deployable behind a range-capable object-store/CDN path.

## Browser runtime proof

The generated files are copied into the built application under:

```text
/rad/biker.compressed-lod.rad
/rad/biker.compressed-lod-*.radc
```

The app exposes:

```text
?renderer=rad
```

That mode constructs Spark's `SplatMesh` with:

```ts
paged: true
```

### Ready-state rule

For paged scenes, `SplatMesh.initialized` alone is **not** sufficient evidence because it may resolve before a RAD page is fetched.

MaybeBoudha only reports RAD `ready` after:

1. Spark decodes the RAD metadata; and
2. the paged source reports **non-zero streamed splats**.

This avoids a false-green empty renderer.

### Chromium evidence

The successful browser probe reported:

- WebGL: available
- WebGL2: available
- renderer state: `ready`
- renderer mode: `rad`
- visible reconstruction: **confirmed from uploaded screenshot**
- displayed LOD splats: **202,475**
- displayed CI load metric: ~**0.36 s**

The FPS/load values from hosted software-rendered Chromium are not device benchmarks.

## Architecture consequence

Phase 3B validates the Phase 2 decision with an actual generated delivery artifact:

```text
PLY → Spark quality LOD → chunked RAD → range delivery → paged Spark
```

No renderer change is required.

## What Phase 3B does not prove

Still unverified:

- real Boudhanath source quality;
- full monument/plaza asset size;
- physical mobile memory;
- physical desktop/mobile FPS;
- real CDN latency/cache behavior;
- reconstruction cleanup quality;
- capture permissions;
- upper-monument coverage.

Those require Phase 3C/3D and later production integration.

## Reusable production rule

Asset processing stays separate from ordinary application CI.

Normal app development should **not** compile Spark's Rust builder.

A production scene release should instead use an asset-processing job that:

1. receives an approved cleaned PLY;
2. builds versioned RAD/RADC;
3. generates a manifest;
4. verifies byte-range behavior;
5. performs browser/runtime validation;
6. publishes an immutable scene version.

## Exit criteria

Phase 3B engineering criteria are met:

1. pinned legal PLY input — **met**
2. pinned Spark builder — **met**
3. pinned/repeatable quality LOD + chunked RAD process — **met**
4. checksums/sizes/chunk count — **met**
5. byte-range delivery — **met**
6. `paged: true` Spark load — **met**
7. non-zero streamed splats — **met**
8. visual Chromium confirmation — **met**
9. asset processing isolated from normal app CI — **met**

**Phase 3B status: complete, merged in PR #4, and verified on main.**
