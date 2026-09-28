# Phase 3P.6 — Real-Capture Go / No-Go Review

## Purpose

Decide whether the current MaybeBoudha prototype is visually convincing enough to justify the time and permission/provenance cost of acquiring a new real-world Boudhanath dataset.

The user's rule for this decision is intentionally strict:

> Do not start permission outreach merely because the technical pipeline works. First make something convincingly good. Only invest in real capture if the prototype becomes realistic enough to justify it.

## Evidence reviewed

### Current default

Route:

`/`

Current composition:

- MiniWorld3D Boudhanath lower monument;
- refined synthetic harmika / eye façade / upper spire;
- licensed photographic eye texture;
- photographic Boudhanath courtyard environment;
- animated prayer flags;
- cinematic camera;
- orbit/zoom interaction;
- deterministic material treatment.

The current experience is coherent and recognizable as Boudhanath.

### Existing-source experiments

The project has additionally tested:

1. procedural Boudhanath geometry;
2. user-supplied MiniWorld3D STL;
3. hybrid STL + refined procedural upper monument;
4. licensed photographic eye/environment imagery;
5. licensed 99,992-point Boudhanath GLB;
6. direct point-cloud rendering;
7. deterministic Poisson surface reconstruction;
8. selective source-derived dome/body integration.

All renderer/reconstruction pipelines are preserved and reproducible.

### Phase 3P.5 A/B

Default hybrid:

- cleaner silhouette;
- cleaner lower monument;
- stronger eye/harmika/spire presentation;
- better finished composition.

Selective Poisson hybrid:

- more source-derived dome geometry;
- smoother continuous reconstructed dome;
- visibly rough lower seam/fringe;
- no photographic RGB;
- weaker finished presentation.

The selective source-derived geometry was correctly rejected as the default.

## Visual assessment

The current default is:

- strong enough to prove the product idea;
- attractive enough to continue as an interactive portfolio prototype;
- technically serious;
- visibly Boudhanath-specific;
- substantially better than the initial procedural-only study.

It is **not** yet:

- photorealistic;
- indistinguishable from a real capture;
- a true reconstruction;
- a digital twin;
- strong enough to justify describing the monument itself as captured reality.

The largest remaining realism gap is **source data**, not another round of hand modeling.

## Decision

# NO-GO — field capture for now

Do **not** reactivate Phase 3C.2 permission outreach yet.

Do **not** send the prepared Department of Archaeology / Boudhanath committee emails yet.

Do **not** perform a systematic field capture yet.

This is a **NO-GO now**, not a permanent rejection.

## Why

The current visual does not yet meet the user's threshold:

> “If we make something better which is very realistic, then I will mail.”

The prototype is good, but it still reads as a crafted 3D hybrid.

Starting permission outreach now would spend real-world effort before the prototype has demonstrated enough visual value to justify that cost.

## What is complete

The project has nevertheless proved the difficult engineering path:

```text
legal source
    ↓
reconstruction / cleanup
    ↓
PLY
    ↓
quality LOD
    ↓
paged RAD
    ↓
range-capable delivery
    ↓
Spark browser runtime
```

Also verified:

- React/Three/Spark architecture;
- PlayCanvas fallback;
- point-cloud inspection;
- deterministic surface reconstruction;
- selective geometry A/B;
- browser screenshot gates;
- licensing/provenance discipline.

None of that work is discarded.

## Next productive track

### Phase 3P.7 — Prototype polish and portfolio-ready release

Do not continue repeatedly remodeling the monument from the same source.

Instead improve the **experience around the strongest current hybrid**:

- cinematic entrance timing;
- camera composition;
- loader/reveal;
- responsive/mobile composition;
- interaction affordances;
- environment blending;
- prayer-flag motion quality;
- subtle atmosphere;
- optional ambient sound only with explicit controls;
- performance profiling;
- accessibility;
- deployable public prototype;
- README/video/screenshots.

The product must remain clearly labeled as a **synthetic visual feasibility study**, not a scan.

## Re-open the real-capture decision when

Any of these happen:

1. a materially better legally usable textured 3D/splat source is found;
2. the polished prototype becomes compelling enough that a real reconstruction is clearly worth the effort;
3. the user explicitly decides the project value now justifies permission outreach;
4. a low-friction legitimate capture opportunity becomes available.

At that point Phase 3C.2 can be reactivated without redesigning the technical pipeline.

## Final Phase 3P.6 status

**Decision: NO-GO for new field capture now.**

**Continue with prototype polish/release.**
