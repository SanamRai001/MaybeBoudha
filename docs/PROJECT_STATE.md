# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based interactive digital-heritage experience centered on Boudhanath Stupa.

The renderer/delivery architecture is proven. Existing-source geometry experiments have reached diminishing returns, so the current product track polishes and deploys the strongest honest synthetic hybrid rather than claiming reconstruction quality the source data cannot support.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `feat/phase-3p7d-audio-release`
- Pull request: `#14 — feat: Phase 3P.7D ambient sound and release readiness`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3P.7C — Environment, atmosphere and performance polish**

Status: **complete and merged**

Merge SHA:

`634442bdc5636ecd9769ab2b6378470e35f1441f`

Final post-merge main checkpoint before 3P.7D:

`9dc8098df7890478b7832d926dd50d02368c9974`

Main CI:

`#238 — green`

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
quality-aware animated prayer flags
        +
cinematic / resettable orbit interaction
        +
optional procedural ambience
```

This remains a **synthetic visual feasibility study**, not a scan or digital twin.

## Current subphase

**Phase 3P.7D — Ambient sound and release readiness**

Status: **implementation/proof complete on PR #14; final documentation-complete verification pending**

Implementation head:

`e97313ad94137db2ff544af0ba2e45ffbc3fd125`

Green:

- CI **#239**
- RAD Pipeline **#133**
- Surface Reconstruction **#42**

Detailed evidence:

`docs/PHASE_3P7D_AUDIO_RELEASE.md`

## Phase 3P.7D delivered

### Opt-in procedural ambience

- generated through Web Audio API;
- no external audio recording;
- no field-recording claim;
- deterministic filtered noise bed;
- off by default;
- created/resumed only after explicit user activation;
- faded in/out;
- suspends while the document is hidden;
- resumes only when visible and previously enabled;
- cleaned up on unmount.

### Browser audio proof

Initial:

```text
state = off
aria-pressed = false
autoplayAudio = false
```

Keyboard Enter activation:

```text
state = on
aria-pressed = true
```

Second Enter activation:

```text
state = off
aria-pressed = false
```

### Mobile proof

Viewport:

`390 × 844`

Verified:

- scrollWidth = 390;
- no horizontal overflow;
- Sound visible;
- Reset visible;
- Focus visible;
- touch orbit still enters `explore`;
- Reset still returns to `home`.

### Release metadata

Added:

- honest title/description;
- Open Graph descriptive metadata;
- Twitter summary metadata;
- manifest;
- robots policy;
- theme/color-scheme metadata.

Intentionally deferred until a real deployment URL exists:

- canonical URL;
- `og:url`;
- hosted `og:image`.

## GLB / source status

The uploaded Boudhanath GLB has already been fully evaluated.

Verified source facts:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- source SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`.

Completed source experiments:

- direct point-cloud rendering;
- deterministic Open3D Poisson surface reconstruction;
- selective source-derived dome/body hybridization.

Decision remains:

**do not replace the Phase 3P.2 hybrid with the point cloud/surface.**

Evidence routes:

- `/?pointcloud=1`
- `/?surface=1`
- `/?selective=1`

Engineering routes:

- `?renderer=spark`
- `?renderer=rad`
- `?renderer=playcanvas`

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Release-candidate state

Ready before deployment:

- desktop/mobile/reduced-motion presentation;
- keyboard Focus/Reset/Sound controls;
- touch orbit;
- device-aware quality;
- runtime profiling;
- audio opt-in policy;
- asset/audio provenance;
- descriptive metadata;
- screenshot artifacts;
- renderer/RAD/source regressions.

Still deployment-specific:

- production host/URL;
- canonical URL;
- `og:url`;
- hosted social preview;
- production cache/header validation;
- production URL smoke.

Still required before performance claims:

- physical desktop GPU measurement;
- physical phone FPS/memory/battery behavior.

## Next subphase after merge

**Phase 3P.7E — Public prototype deployment and portfolio packaging**

Scope:

1. choose actual hosting target;
2. deploy current release candidate without monument/source changes;
3. set canonical / `og:url` from the real URL;
4. publish a social-preview image;
5. verify production caching and asset delivery;
6. run production URL desktop/mobile smoke;
7. capture final portfolio screenshots/media.

## Guardrails

Do not:

- change monument/source geometry in deployment work;
- restart point-cloud/surface experiments;
- change the field-capture NO-GO decision;
- send permission outreach;
- claim the prototype is a scan/digital twin;
- describe procedural audio as real Boudhanath sound.

## Resume rule

1. inspect PR #14 and all three workflow results;
2. repository state wins over documentation if they differ;
3. merge only after CI, RAD Pipeline and Surface Reconstruction are green on the documentation-complete head;
4. checkpoint the actual merge SHA on `main`;
5. only then start 3P.7E;
6. choose/confirm a real hosting target before writing canonical deployment URLs.
