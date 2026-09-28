# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based interactive digital-heritage experience centered on Boudhanath Stupa.

The renderer/delivery architecture is proven. Existing-source geometry experiments have reached diminishing returns, so the current product track deploys and packages the strongest honest synthetic hybrid rather than claiming reconstruction quality the source data cannot support.

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

Status: **deployment implementation merged; blocked on one-time GitHub Pages enablement**

Deployment preparation PR:

`#15 — deploy: Phase 3P.7E GitHub Pages prototype`

Merge SHA:

`e6637350e34ecee8e74a8583bd9856ebc4ecaac3`

Verified on the PR head:

- normal tests/build: **passed**;
- Pages-specific project-path build: **passed**;
- Pages build integrity check: **passed**;
- desktop prototype: **passed**;
- mobile prototype: **passed**;
- reduced-motion prototype: **passed**;
- uploaded Boudhanath model probe: **passed**;
- licensed point-cloud probe: **passed**;
- Spark probe: **passed**;
- PlayCanvas probe: **passed**;
- surface reconstruction regression: **passed**;
- selective hybrid regression: **passed**.

## Hosting decision

First public host:

**GitHub Pages**

Reason:

- repository is public;
- application is static Vite;
- no extra hosting account or secret is required;
- deployment can stay inside GitHub Actions;
- the release-candidate visual remains unchanged.

## Deployment implementation

Merged to `main`:

- configurable Vite base path;
- project-path-safe panorama/model/surface URLs;
- base-aware brand navigation;
- relative manifest `start_url` / `scope`;
- `.github/workflows/deploy-pages.yml`;
- Pages build integrity script.

The Pages PR build successfully validated a `/MaybeBoudha/` bundle.

## Current blocker

The first real deployment run:

`Deploy GitHub Pages #2`

built and validated the production bundle successfully, then failed at:

`Configure GitHub Pages`

with:

`Get Pages site failed ... repository has Pages enabled and configured to build using GitHub Actions ... Not Found`

This means the repository does not yet have a GitHub Pages site enabled.

### Required one-time user action

In GitHub:

```text
MaybeBoudha
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

After that, rerun the failed `Deploy GitHub Pages #2` workflow or trigger `Deploy GitHub Pages` manually.

No code change is required for this blocker.

## After Pages deploys successfully

Continue Phase 3P.7E with:

1. capture the actual Pages URL from the deployment output;
2. add canonical URL;
3. add `og:url`;
4. publish a hosted social-preview image;
5. verify production cache/static-asset behavior;
6. run production desktop/mobile URL smoke;
7. capture final portfolio screenshots/media;
8. checkpoint the final public release state.

Do not hard-code/invent the public URL before GitHub Pages succeeds.

## Still required before performance claims

- physical desktop GPU measurement;
- physical phone FPS/memory/battery behavior.

## Guardrails

Deployment work must not:

- change monument/source geometry;
- restart point-cloud/surface experiments;
- change field-capture NO-GO;
- send permission outreach;
- claim scan/digital-twin status;
- weaken existing CI/RAD/surface gates.

## Resume rule

1. inspect actual `main` and deployment workflow state;
2. repository state wins over documentation if they differ;
3. if Pages is still disabled, ask the user only for the one-time Pages source change;
4. once Pages is enabled, rerun/dispatch the deploy workflow;
5. use the real deployment URL for canonical/social metadata;
6. keep the release candidate visually/source-stable.
