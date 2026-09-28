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

Status: **public deployment is live; release-hardening verification in progress**

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

## Public deployment

GitHub Pages is enabled and the production deployment succeeded from:

`4b948ece4179461911f417a05f8f95b68a381571`

Verified deployment run:

`Deploy GitHub Pages #6 — attempt 2 — success`

Production URL:

`https://sanamrai001.github.io/MaybeBoudha/`

The former `Configure GitHub Pages` blocker is resolved.

## Release-hardening branch

Current branch:

`release/phase-3p7e-public-release`

This branch is intentionally limited to:

- canonical and Open Graph/Twitter production metadata;
- an automatically captured real release-candidate social-preview image;
- production HTTP/static-asset verification;
- production desktop/mobile/reduced-motion browser smoke;
- final release media artifact capture.

No renderer, monument/source geometry, capture decision, or field-outreach behavior changes in this work.

## Remaining Phase 3P.7E work

Continue Phase 3P.7E with:

1. merge the release-hardening PR after CI is green;
2. confirm the post-merge Pages deploy is green;
3. confirm production HTTP/static-asset verification is green;
4. confirm production desktop/mobile/reduced-motion browser smoke is green;
5. download/check the final release-media artifact if a manual visual review is needed;
6. checkpoint the final public release state with the merge SHA and deployment run.

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
