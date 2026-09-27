# Phase 3P — Visual Feasibility Prototype

## Purpose

Phase 3P proves the product experience before MaybeBoudha invests in systematic field capture and its external permission/provenance cost.

The rule remains:

> Build something convincing first. Only pursue real capture when the expected value is obvious.

Phase 3C field-clearance preparation remains preserved, but deferred.

## What the default scene is now

Phase 3P began as a fully procedural Boudhanath study.

By the end of Phase 3P.2 the default scene is **hybrid**, not purely procedural:

```text
licensed/reference geometry
        +
procedural upper detail
        +
licensed eye image
        +
public-domain real courtyard panorama
        +
Three.js lighting / motion / camera
```

It still contains **no Boudhanath scan, photogrammetry, NeRF, or Gaussian Splat capture data**.

It must not be called a digital twin, measured reconstruction, or conservation model.

## Phase 3P.1 — Composition baseline

Delivered the initial full-screen experience:

- approximate monument scale;
- stepped base and white dome;
- harmika / Buddha eyes;
- thirteen-stage upper structure;
- prayer wheels;
- animated prayer flags;
- synthetic courtyard;
- cinematic entry;
- orbit / zoom;
- reduced motion;
- editorial UI;
- screenshot regression gate.

Result:

**successful product/composition proof, visibly synthetic.**

## Phase 3P.2 — Realism and material pass

### Hybrid Boudhanath geometry

The user supplied MiniWorld3D's Boudhanath STL.

The original source is retained as provenance outside the browser package.

Verified source facts:

- 727,784 bytes;
- 14,554 triangles;
- watertight;
- SHA-256:
  `26056855d10d51b9af31bf75cd7eebca0ab161a70c8aeafb664b7e0df621d5e9`.

For web delivery the mesh is:

- deduplicated/indexed;
- position-quantized;
- gzip packed;
- split into small static chunks;
- rebuilt in the browser.

The imported mesh's lower monument/dome detail is combined with the project's refined procedural upper structure.

The printable model is intentionally rescaled for this visual study and is not survey-grade.

### Surface/detail improvements

- deterministic plaster variation on imported vertices;
- photographic Buddha-eye texture;
- refined gold treatment;
- sloped/frustum thirteen-stage spire;
- denser base detail;
- prayer flags and prayer-wheel ring;
- stronger contact grounding.

### Photographic environment

The earlier synthetic shop/building ring is now fallback only.

The successful default path uses the public-domain Wikimedia panorama:

`P37275-Kathmandu-Boudhanath.jpg`

by Xiquinho.

The source description identifies it as a panorama taken from Boudhanath showing surrounding shops and temples.

A reduced derivative is mapped onto an inward-facing cylindrical environment around the interactive 3D monument.

This provides real Boudhanath context without pretending the photo is reconstruction data.

### Camera / composition

- lower human-scale view;
- tighter framing;
- cinematic entry retained;
- panorama height/crop tuned to remove the visible top seam;
- contact shadow added;
- photo environment color reduced slightly to blend with the 3D scene.

## Verification

Final visual implementation head:

`27e422c4f2df863ea8d69955c17cc8b1576aba8b`

Final documentation-complete PR head:

`8be8bcc74642b6fffc82147b63823718ebeedabf`

Merged as:

`3ff3d7bbeb4175f02f5fdcde758ca30864e43643`

Final PR verification:

- CI #153 — green
- RAD Pipeline #80 — green

The direct visual artifact reviewed for the final material pass came from CI #147.

CI #147:

- tests — passed;
- production build — passed;
- default hybrid visual probe — passed;
- explicit licensed-model probe — passed;
- Spark regression — passed;
- PlayCanvas regression — passed;
- final material-balanced screenshot artifact — inspected directly.

RAD Pipeline #74:

- application tests — passed;
- Spark LOD build — passed;
- RAD/RADC generation — passed;
- range delivery — passed;
- paged Spark runtime — passed.

## Visual assessment after Phase 3P.2

### Major gains

- the courtyard now looks like Boudha rather than a generic procedural plaza;
- hybrid geometry improves lower-monument silhouette/detail;
- human-scale framing removes much of the miniature/toy impression;
- photo-textured eyes read clearly;
- sloped upper tiers are more convincing than stacked boxes;
- the composition now demonstrates the final experiential idea.

### Remaining gap

The central monument is still visibly rendered 3D rather than captured reality.

Reasons:

- the STL is an artistic print model;
- the dome lacks capture-derived microgeometry;
- weathering is generated;
- the upper structure remains procedural;
- photo environment and 3D geometry are not calibrated from one real capture;
- no true point/splat reconstruction is present.

## Phase 3P.2 verdict

**Successful. Keep the project and stop hand-modeling the monument further for now.**

Another round of procedural detail has diminishing returns.

The next realism jump should come from a real-data asset.

Field-clearance outreach is **still deferred** because an already-existing licensed point-cloud candidate should be tested first.

## Phase 3P.3 — Licensed point-cloud spike

A promising candidate exists on Sketchfab:

`BOUDHANATH STUPA - POINTCLOUD`

Published by Enea Le Fons / `@enealefons`.

Public listing reports:

- ~100k vertices;
- 0 triangles;
- downloadable;
- CC Attribution;
- published 10 February 2021;
- NoAI restriction.

NoAI is compatible with this planned use because MaybeBoudha will treat it only as a 3D visual asset and will **not** use it for AI training, model development, or generative-AI input.

### Phase 3P.3 work

1. obtain the original downloadable asset;
2. preserve source/license metadata;
3. checksum the original;
4. inspect point color/format/scale/orientation;
5. test direct Three.js point rendering;
6. test conversion to PLY if useful;
7. compare it visually with the Phase 3P.2 hybrid;
8. keep hybrid/procedural fallback paths.

### Exit question

> Does this existing licensed point cloud provide the realism jump we need?

If yes:

continue integrating/optimizing it without requiring a new field capture.

If no:

we now have enough evidence to decide whether a controlled Boudhanath capture is worth reactivating Phase 3C.2 field clearance.
