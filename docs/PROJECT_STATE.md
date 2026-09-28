# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based interactive digital-heritage experience centered on Boudhanath Stupa.

The renderer/delivery architecture is proven. Existing-source geometry experiments have reached diminishing returns, so the current product track polishes and deploys the strongest honest synthetic hybrid rather than claiming reconstruction quality the source data cannot support.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `main`
- Working title: `MaybeBoudha`

## Last completed subphase

**Phase 3P.7D — Ambient sound and release readiness**

Status: **complete and merged**

PR:

`#14 — feat: Phase 3P.7D ambient sound and release readiness`

Merge SHA:

`1f269049c590d5615d01fbe88fbcfd334280dbd5`

Documentation-complete head:

`038ab968e747d1794fa744f45d57b907ea3378c0`

Green on that head:

- CI **#242**
- RAD Pipeline **#136**
- Surface Reconstruction **#45**

Detailed evidence:

`docs/PHASE_3P7D_AUDIO_RELEASE.md`

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

## Phase 3P.7D outcome

Delivered:

- opt-in procedural Web Audio ambience;
- sound off by default;
- real keyboard off → on → off proof;
- no autoplay audio element;
- hidden-page suspension behavior;
- no third-party/field-recording audio claim;
- desktop/mobile/reduced-motion regressions preserved;
- mobile Sound / Reset / Focus controls all visible at 390 × 844;
- honest page/Open Graph/Twitter descriptive metadata;
- manifest and robots policy;
- audio provenance documentation;
- deterministic portfolio screenshot artifacts.

## Release-candidate state

Ready before deployment:

- desktop/mobile/reduced-motion presentation;
- keyboard Focus/Reset/Sound controls;
- touch orbit;
- device-aware quality;
- runtime profiling;
- opt-in audio;
- asset/audio provenance;
- descriptive metadata;
- screenshot artifacts;
- renderer/RAD/source regressions.

Still deployment-specific:

- actual host and URL;
- canonical URL;
- `og:url`;
- hosted social-preview image;
- production cache/header verification;
- production URL smoke.

Still required before performance claims:

- physical desktop GPU measurement;
- physical phone FPS/memory/battery behavior.

## Current deployment state

No deployment configuration exists on `main` yet.

No:

- Vercel config;
- Netlify config;
- Cloudflare config;
- GitHub Pages workflow;
- CNAME;
- deployment workflow.

Do not invent a canonical production URL before a real host exists.

## GLB / source decision

The uploaded Boudhanath GLB has already been fully evaluated:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- source SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`.

Completed:

- direct point-cloud rendering;
- deterministic Open3D Poisson surface reconstruction;
- selective source-derived dome/body hybridization.

Decision remains:

**keep the Phase 3P.2 hybrid as the default.**

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Current subphase

**Phase 3P.7E — Public prototype deployment and portfolio packaging**

Status: **not started**

Scope:

1. choose the actual hosting target;
2. deploy the current release candidate without monument/source changes;
3. set canonical / `og:url` from the real deployed URL;
4. publish a social-preview image;
5. verify production caching and asset delivery;
6. run production URL desktop/mobile smoke;
7. capture final portfolio screenshots/media.

## Guardrails

Deployment work must not:

- change monument/source geometry;
- restart point-cloud/surface experiments;
- change field-capture NO-GO;
- send permission outreach;
- claim scan/digital-twin status;
- invent a domain/canonical URL;
- weaken existing CI/RAD/surface gates.

## Next branch

`feat/phase-3p7e-public-deploy`

## Resume rule

1. inspect actual `main` and post-merge CI;
2. repository state wins over documentation if they differ;
3. start 3P.7E only from verified `main`;
4. inspect available deployment options before choosing a host;
5. ask the user only if a deployment target cannot be determined safely;
6. keep the release candidate visually/source-stable.
