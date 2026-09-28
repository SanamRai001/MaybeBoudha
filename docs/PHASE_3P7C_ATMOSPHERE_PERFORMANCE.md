# Phase 3P.7C — Environment, Atmosphere and Performance Proof

## Purpose

Phase 3P.7C polishes the strongest existing MaybeBoudha hybrid without changing monument/source geometry.

The phase focuses only on:

- prayer-flag motion;
- photographic-environment blending;
- lighting/fog balance;
- device-aware rendering quality;
- lightweight runtime performance instrumentation;
- screenshot-driven visual review.

Audio remains deferred until this visual/performance layer is stable.

## Visual changes

### Prayer flags

The previous single-axis sine motion was replaced with calmer multi-axis movement.

Each flag now has:

- its own phase;
- its own amplitude;
- slow primary sway;
- smaller secondary gust motion;
- subtle X-axis tilt;
- small vertical travel.

Motion intensity is scaled by the active quality profile.

With `prefers-reduced-motion: reduce`, decorative flag animation is disabled.

### Photographic environment blend

The Boudhanath courtyard panorama no longer appears through a hard visibility swap.

New behavior:

```text
procedural surroundings
        ↓
panorama loads
        ↓
~1.3 s eased cross-fade
        ↓
procedural surroundings hidden after blend passes midpoint
        ↓
photographic environment remains
```

This avoids a visible pop while still retaining the procedural environment as the load-failure fallback.

### Lighting and fog

The final pass slightly reduced the artificial contrast of the scene:

- softer, warmer fog;
- slightly higher tone-mapping exposure;
- lower hemisphere intensity;
- lower direct sun intensity;
- softer fill light;
- panorama participates in the scene's tone mapping;
- panorama depth writing remains disabled.

The goal is not cinematic exaggeration. The monument should sit more naturally inside the photographic surroundings.

## Device-aware quality policy

New quality profiles:

```text
mobile
balanced
high
```

Selection considers:

- viewport width;
- device pixel ratio;
- hardware concurrency;
- reported device memory when available.

### Mobile

Used when:

- viewport is narrow; or
- CPU core count is low; or
- reported memory is low.

Profile:

- max DPR: **1.15**
- shadow map: **1024**
- max anisotropy: **4**
- flag-motion scale: **0.72**

### Balanced

Profile:

- max DPR: **1.35**
- shadow map: **1536**
- max anisotropy: **6**
- flag-motion scale: **0.86**

### High

Used on wider, higher-capability devices.

Profile:

- max DPR: **1.60**
- shadow map: **2048**
- max anisotropy: **8**
- flag-motion scale: **1.00**

The renderer never intentionally oversamples beyond the selected profile cap.

## Runtime instrumentation

The prototype canvas exposes:

```text
data-quality-tier
data-renderer-dpr
data-fps
```

FPS is sampled over approximately one-second windows and smoothed so the value is useful as lightweight runtime telemetry without introducing a heavy profiler.

The browser smoke test requires:

- a resolved quality tier;
- positive renderer DPR;
- DPR <= 1.60;
- positive sampled FPS.

For mobile emulation it additionally requires:

- quality tier = `mobile`;
- renderer DPR <= 1.15.

## Verified browser evidence

PR:

`#13 — feat: Phase 3P.7C atmosphere and performance polish`

Implementation head:

`61e5cdf1149264c51e00362508e98ca7193bd7f0`

Green:

- CI **#231**
- RAD Pipeline **#128**
- Surface Reconstruction **#37**

### Desktop prototype

The hosted CI runner reported:

```text
qualityTier = mobile
rendererDpr = 1.0
sampled FPS ≈ 1.5
```

The desktop route selected the mobile/constrained tier because the CI machine exposes constrained/virtualized hardware characteristics.

That is acceptable and proves the quality policy reacts to capability rather than viewport width alone.

### Mobile prototype

Viewport:

`390 × 844`

Verified:

- quality tier = `mobile`;
- renderer DPR = **1.0**;
- no horizontal overflow;
- Focus control visible;
- Reset control visible;
- real emulated touch drag enters `explore`;
- Reset returns to `home`.

### Reduced motion

Verified:

- media preference is detected;
- camera reaches `home`;
- UI reports Reduced motion;
- Reset remains functional;
- flag animation is not required for the experience.

## FPS interpretation

The CI screenshots are rendered through virtualized/software graphics.

Observed ~1–2 FPS values are therefore **not physical-device performance benchmarks**.

They are retained only as proof that:

- runtime sampling works;
- values are finite and positive;
- the quality policy is active;
- CI does not silently render with unbounded DPR.

Real performance claims still require physical desktop/mobile measurements.

## Screenshot review

Desktop, mobile, and reduced-motion screenshots were inspected directly.

### Desktop

Accepted:

- photographic courtyard remains visually coherent;
- cross-fade does not leave duplicate synthetic surroundings;
- monument remains the dominant subject;
- story overlay remains readable;
- lighting/fog do not wash out the eye façade or upper spire.

### Mobile

Accepted:

- the monument remains intentionally dominant;
- title/status/controls remain readable;
- photographic surroundings still provide context;
- no blocking crop or horizontal overflow was introduced.

### Reduced motion

Accepted:

- visual composition remains equivalent to desktop;
- the experience does not depend on decorative motion to communicate the scene.

## Regression coverage

The phase preserved:

- uploaded MiniWorld model route;
- licensed point-cloud route;
- Spark regression;
- PlayCanvas regression;
- RAD pipeline;
- deterministic surface reconstruction.

No monument/source geometry was changed.

## Decision

**Phase 3P.7C is accepted.**

The current environment/atmosphere/quality layer is stable enough to stop tuning it without new real-device evidence.

Do not interpret more CI-side lighting/FPS tweaking as useful optimization.

## Guardrails

Phase 3P.7C does not:

- claim the prototype is scan data;
- replace the Phase 3P.2 hybrid;
- restart GLB/point-cloud/surface experiments;
- change the field-capture NO-GO decision;
- send permission outreach;
- add audio.

## Next

### Phase 3P.7D — Ambient sound and release readiness

Only after 3P.7C is merged:

1. add optional ambient sound;
2. require explicit user audio control;
3. no forced/uncontrolled audio playback;
4. pause/suppress audio when appropriate;
5. record audio licensing/provenance;
6. prepare public-deployment metadata and portfolio media;
7. keep current monument/source geometry unchanged.
