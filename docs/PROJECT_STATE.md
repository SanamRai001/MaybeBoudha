# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The real reconstruction pipeline is already proven technically. The current product track is validating visual value with licensed/synthetic assets before spending effort on systematic field capture.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p-visual-prototype`
- Pull request: `#6 — feat: Phase 3P synthetic Boudhanath visual prototype`
- Working title: `MaybeBoudha`

## Current milestone

**Phase 3P.2 — Realism and material pass**

Status: **implementation and direct screenshot review complete; final documentation-complete CI pending**

Latest visually reviewed implementation head:

`13e593c637f4f83e85eb57dbd67e06c3f49e57a7`

Verification:

- CI #145 — green;
- locked install — passed;
- tests — passed;
- production build — passed;
- default hybrid visual probe — passed;
- explicit uploaded-model probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- RAD Pipeline #72 — green;
- generated paged RAD runtime — passed.

## Phase 3P.2 delivered

### Monument

The default scene no longer relies on a fully procedural monument.

It uses:

```text
user-supplied MiniWorld3D Boudha.STL
        ↓
compact indexed/quantized MBV2 browser package
        ↓
lower monument / dome detail
        +
refined procedural harmika + upper spire
```

Source STL facts:

- 727,784 bytes;
- 14,554 triangles;
- 7,281 indexed vertices in the browser package;
- watertight source mesh;
- source SHA-256:
  `26056855d10d51b9af31bf75cd7eebca0ab161a70c8aeafb664b7e0df621d5e9`.

The STL is artistic 3D-print geometry, not scan data.

The hybrid adds:

- deterministic vertex-color plaster weathering;
- refined eye/harmika treatment;
- licensed photographic eye texture;
- sloped thirteen-stage spire tiers;
- prayer wheels;
- animated flags;
- physical lighting and shadows.

### Environment

The procedural courtyard is now a fallback.

Default successful load uses:

`P37275-Kathmandu-Boudhanath.jpg`

- author: Xiquinho;
- Wikimedia Commons;
- public domain;
- panorama taken from Boudhanath showing surrounding shops and temples.

The project bundles a reduced runtime derivative and maps it onto an inward-facing cylindrical environment.

The central monument remains interactive 3D.

### Experience

- full-screen editorial composition;
- cinematic entry;
- orbit / zoom;
- reduced motion;
- human-scale camera;
- contact shadow;
- explicit `Synthetic study · no scan data` disclosure;
- engineering Spark/RAD/PlayCanvas routes preserved.

## Visual assessment

### Strong

- photographic plaza removes most of the synthetic-environment look;
- Boudhanath silhouette reads immediately;
- hybrid lower geometry is more detailed than the procedural baseline;
- eye façade and stepped upper structure read much closer to the real monument;
- flags create useful depth and motion;
- scene now demonstrates the intended final product experience rather than only a renderer.

### Still synthetic

- monument is not capture-derived;
- MiniWorld3D source is a printable interpretation;
- plaster/weathering remains generated rather than photographed/scanned;
- upper structure is still procedural;
- environment photo and 3D monument do not share true camera calibration;
- no scan-level occlusion/microgeometry;
- not suitable for survey/conservation claims.

## Product verdict

**Keep the project.**

The prototype is strong enough to show that a genuinely reconstructed Boudhanath experience could be valuable.

However, the current monument is still not realistic enough to justify sending the field-clearance emails yet.

Before asking authorities or capturing a systematic dataset, test the strongest already-existing licensed real-data candidate we can find.

## Next subphase

### Phase 3P.3 — Licensed Boudhanath point-cloud spike

Candidate identified:

- title: `BOUDHANATH STUPA - POINTCLOUD`;
- platform: Sketchfab;
- author: Enea Le Fons / `@enealefons`;
- published: 2021;
- vertices: ~100k;
- triangles: 0;
- license: CC Attribution;
- downloadable;
- NoAI: do not use the asset for training or as input to generative-AI systems.

Next actions:

1. obtain the downloadable point-cloud asset with provenance intact;
2. record exact license/source/download metadata;
3. checksum the original archive/file;
4. inspect file format, point colors, orientation, and completeness;
5. test direct point rendering and/or convert to PLY;
6. compare against the Phase 3P.2 hybrid screenshot;
7. retain the hybrid scene as fallback.

If direct download requires a Sketchfab login and cannot be obtained through the current toolchain, ask the user to download the model and upload the archive here.

## Deferred field-clearance path

Phase **3C.2 — Field clearance** remains prepared.

Do not start systematic real Boudhanath photography while that gate is unsatisfied.

Do not send the prepared permission emails solely because the synthetic prototype exists.

Reactivate clearance only if the point-cloud spike still leaves a clear reason to perform our own real capture.

## Resume rule

1. verify PR #6 final documentation CI;
2. merge PR #6 only when green;
3. checkpoint actual merge SHA on `main`;
4. create Phase 3P.3 from verified `main`;
5. obtain/inspect the licensed point-cloud asset;
6. keep all provenance/licensing facts explicit;
7. do not claim a digital twin or real scan without supporting source evidence.
