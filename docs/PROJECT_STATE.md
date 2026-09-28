# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based, photorealistic interactive heritage experience centered on Boudhanath Stupa.

The rendering/delivery architecture is proven. Existing-source geometry experiments have reached diminishing returns, so current work is polishing the strongest honest hybrid rather than claiming reconstruction quality the source data cannot support.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p7c-atmosphere-performance`
- Pull request: `#13 — feat: Phase 3P.7C atmosphere and performance polish`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3P.7B — Camera, interaction, mobile and accessibility polish**

Status: **complete and merged**

PR:

`#12 — feat: Phase 3P.7B camera interaction and mobile proof`

Merge SHA:

`942ef9a36554d2bd1f1be06097bc0c4b0e4708a9`

Final post-merge main checkpoint before 3P.7C:

`b005cca819ad2fd541bec2621dad67648f2cedd4`

Main CI:

`#230 — green`

## Current strongest visual

Default route:

`/`

Composition:

```text
MiniWorld3D lower monument
        +
refined synthetic upper monument
        +
licensed photographic eye treatment
        +
photographic Boudhanath courtyard environment
        +
animated prayer flags
        +
cinematic / resettable orbit interaction
```

This remains a **synthetic visual feasibility study**, not a scan or digital twin.

## GLB / source status

The uploaded Boudhanath GLB has already been integrated and evaluated.

Verified source facts:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- source SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`.

Follow-up work already completed:

- direct point-cloud rendering;
- deterministic Open3D Poisson surface reconstruction;
- selective source-derived dome/body hybridization.

Decision remains:

**do not replace the Phase 3P.2 hybrid with the point cloud/surface.**

Evidence routes:

- `/?pointcloud=1`
- `/?surface=1`
- `/?selective=1`

Engineering renderer routes:

- `?renderer=spark`
- `?renderer=rad`
- `?renderer=playcanvas`

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Current subphase

**Phase 3P.7C — Environment, atmosphere and performance polish**

Status: **implementation/proof complete on PR #13; final documentation-complete verification pending**

Implementation head:

`61e5cdf1149264c51e00362508e98ca7193bd7f0`

Verified green:

- CI **#231**
- RAD Pipeline **#128**
- Surface Reconstruction **#37**

## Phase 3P.7C delivered

### Prayer-flag motion

- multi-axis motion;
- per-flag phase/amplitude;
- slower primary sway;
- smaller gust component;
- quality-tier motion scaling;
- decorative movement disabled by reduced-motion mode.

### Environment blending

- photographic panorama no longer hard-swaps;
- ~1.3 s eased cross-fade;
- procedural surroundings remain as load-failure fallback;
- synthetic surroundings are hidden only after the photographic blend is established.

### Lighting / atmosphere

- softer fog;
- refined tone-mapping exposure;
- lower hemisphere/sun intensity;
- softer fill light;
- panorama participates in tone mapping;
- panorama does not write depth.

### Device-aware quality

Profiles:

```text
mobile
balanced
high
```

Quality selection considers:

- viewport width;
- device pixel ratio;
- hardware concurrency;
- reported device memory when available.

Caps:

```text
mobile:
  DPR <= 1.15
  shadows 1024
  anisotropy 4

balanced:
  DPR <= 1.35
  shadows 1536
  anisotropy 6

high:
  DPR <= 1.60
  shadows 2048
  anisotropy 8
```

### Runtime instrumentation

Prototype canvas exposes:

- `data-quality-tier`;
- `data-renderer-dpr`;
- `data-fps`.

FPS is sampled in lightweight one-second windows and smoothed.

## Browser evidence

Hosted CI selected:

```text
qualityTier = mobile
rendererDpr = 1.0
sampled FPS ≈ 1.5
```

The desktop screenshot also used the constrained/mobile tier because the CI runner exposes constrained virtualized hardware characteristics.

This is expected.

**CI FPS is not a physical-device performance benchmark.**

### Mobile

Viewport:

`390 × 844`

Verified:

- quality tier = mobile;
- renderer DPR = 1.0;
- scrollWidth = 390;
- no horizontal overflow;
- Focus control visible;
- Reset control visible;
- emulated touch drag enters `explore`;
- Reset returns to `home`.

### Reduced motion

Verified:

- `prefers-reduced-motion: reduce` is honored;
- camera reaches `home`;
- UI reports Reduced motion;
- interaction/reset remains functional.

### Screenshot review

Desktop, mobile, and reduced-motion screenshots were inspected directly.

Accepted:

- photographic environment remains coherent;
- no duplicate synthetic surroundings after the cross-fade;
- monument remains dominant;
- eye façade/spire remain readable;
- mobile composition remains usable;
- no blocking crop/overflow regression;
- reduced-motion composition remains equivalent.

Detailed evidence:

`docs/PHASE_3P7C_ATMOSPHERE_PERFORMANCE.md`

## Guardrails

3P.7C does not:

- change monument/source geometry;
- change the Phase 3P.6 field-capture NO-GO decision;
- restart point-cloud/surface experiments;
- send permission outreach;
- add audio;
- claim the prototype is a scan or digital twin.

## Next subphase after merge

**Phase 3P.7D — Ambient sound and release readiness**

Scope only:

1. optional ambient sound;
2. explicit audio control;
3. no forced audio playback;
4. pause/suppress audio when appropriate;
5. audio licensing/provenance;
6. public-deployment metadata;
7. portfolio screenshots/media;
8. keep monument/source geometry unchanged.

## Resume rule

1. inspect PR #13 head and all three workflow results;
2. repository state wins over documentation if they differ;
3. merge only after CI, RAD Pipeline, and Surface Reconstruction are green on the documentation-complete head;
4. post-merge, record the actual merge SHA on `main`;
5. only then begin 3P.7D;
6. keep field-clearance outreach deferred unless the user explicitly changes the decision.
