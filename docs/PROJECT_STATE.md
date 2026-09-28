# Project State

This is the canonical checkpoint for continuing MaybeBoudha work. Repository state wins if this file becomes stale.

## Objective

Build a browser-based interactive digital-heritage experience centered on Boudhanath Stupa while being explicit about source quality and provenance.

The current public release is an **honest synthetic visual feasibility study**, not a scan or digital twin.

## Repository

- Repository: `SanamRai001/MaybeBoudha`
- Default branch: `main`
- Current branch: `fix/monument-scale-proportions`
- Public URL: `https://sanamrai001.github.io/MaybeBoudha/`

## Last completed phase

**Phase 3P.7E — Public prototype deployment and portfolio packaging**

Status: **complete and merged**

Release-hardening PR:

`#16 — release: complete Phase 3P.7E public Pages hardening`

Merge SHA:

`ef577bca2b0253336a7c00781a85b17664b54a99`

## What shipped

The public release now includes:

- GitHub Pages deployment at the real project-path URL;
- project-path-safe Vite assets and relative web-manifest scope;
- canonical URL and `og:url`;
- large Open Graph/Twitter social metadata;
- a 1200 × 630 social-preview image captured from the actual release-candidate scene during the Pages build;
- production HTTP/static-asset verification;
- production desktop, 390 × 844 mobile, and reduced-motion browser smoke;
- final production screenshots uploaded as a release-media workflow artifact;
- README live link.

No renderer, monument/source geometry, capture decision, or field-outreach behavior changed in Phase 3P.7E.

## Release verification

Verified on release SHA:

`ef577bca2b0253336a7c00781a85b17664b54a99`

Post-merge gates:

- `Deploy GitHub Pages #8` — **passed**;
- production HTTP/static-asset verification — **passed**;
- production desktop browser probe — **passed**;
- production mobile browser probe — **passed**;
- production reduced-motion browser probe — **passed**;
- `CI #254` — **passed**;
- `RAD Pipeline #139` — **passed**;
- `Surface Reconstruction #50` — **passed**.

Production delivery evidence:

- root HTML: `text/html; charset=utf-8`;
- root cache policy: `max-age=600`;
- manifest: `application/manifest+json; charset=utf-8`;
- hosted social preview: `image/png`, 1,051,696 bytes;
- hosted panorama: `image/jpeg`, 1,137,268 bytes;
- deployed JavaScript: 3,764,102 bytes;
- deployed CSS: 16,155 bytes;
- all verified production assets remained under `/MaybeBoudha/`.

Final release-media artifact:

`phase-3p7e-production-release-media`

Artifact ID:

`10975812936`

The desktop, mobile, and reduced-motion screenshots were inspected and were visually healthy.

## Current strongest visual

Default production route:

`https://sanamrai001.github.io/MaybeBoudha/`

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

## GLB / source decision

The uploaded Boudhanath GLB has already been fully evaluated:

- 99,992 points;
- 0 triangles;
- normals present;
- uniform gray stored color;
- SHA-256:
  `ff5ef7d2c124953b6e053a98b945ef3cad50b8ab524e31c7d78bb6737307169c`.

Completed experiments:

- direct point-cloud rendering;
- deterministic Open3D Poisson surface reconstruction;
- selective source-derived dome/body hybridization.

Decision remains:

**keep the Phase 3P.2 hybrid as the default.**

Do not repeat these experiments unless a genuinely better source appears.

## Field-clearance state

Phase **3C.2 — Field clearance** remains prepared but deferred.

Current decision:

**NO-GO for field capture right now.**

Do not send permission emails automatically.

## Performance caveat

Hosted-runner FPS is only a functional telemetry signal and must not be presented as real-device performance.

Still required before physical-device performance claims:

- physical desktop GPU measurement;
- physical phone FPS/memory/battery behavior.

## Risks / decisions

- The current experience is intentionally synthetic and must not be described as a scan, photogrammetric reconstruction, or digital twin.
- Existing-source geometry work has reached diminishing returns.
- GitHub Pages currently returns a 10-minute cache policy for the checked release resources; the release verifier records the live headers rather than assuming CDN behavior.
- The release pipeline now exercises production after deployment, reducing the chance of a green build hiding a broken public path.

## Current phase

**Phase 3P.7F-A — Monument scale/proportion correction**

Status: **in progress on `fix/monument-scale-proportions`**

User screenshot review found that the released monument reads as a small, thin model inside the photographic courtyard.

Root cause confirmed in code:

- the packed MiniWorld3D source is approximately 108 × 54.4 × 108 in source proportions;
- its vertical scale was calibrated to 43.25 m;
- its entire horizontal footprint was then compressed to only 43.5 m;
- the default route hides the procedural lower monument and therefore inherits that compressed lower silhouette.

This phase corrects the horizontal visual calibration to **82.2 m** while keeping the 43.25 m height unchanged. The target is intentionally approximate and corresponds to the square-equivalent width of the published 6,756 m² stupa area.

Related scene radii (prayer-wheel ring, kora path, contact shadow, fallback scale figures, and prayer-flag anchors) are recalibrated with the larger footprint.

Guardrails for 3P.7F-A:

- do not change the upper harmika/spire;
- do not change the camera/FOV in this first correction;
- do not change the photographic environment;
- do not restart point-cloud/surface experiments;
- do not merge until the new desktop/mobile screenshots are inspected.

## Next phase

Run the full existing test/runtime gates and inspect the new screenshot against the user-provided release screenshot.

If the monument mass is correct, keep the geometry correction and only make small camera/framing adjustments if still needed.

If it is too wide, tune the footprint target before merge.

## Resume rule

1. inspect actual `main`, workflow state, and the public URL;
2. repository state wins over this document;
3. preserve the public release and source/provenance guardrails;
4. do not redo the processed GLB work;
5. keep the field-capture NO-GO unless explicitly changed.
