# Phase 3P — Synthetic Visual Feasibility Prototype

## Purpose

Phase 3P exists because the real-world capture path has external permission/provenance cost.

Before spending that effort, MaybeBoudha should prove that the experience direction is visually strong enough to justify a real reconstruction.

This phase is therefore **synthetic by design**.

It does not use:

- a real Boudhanath scan;
- photogrammetry from Boudhanath;
- Gaussian Splat capture data from Boudhanath;
- scraped internet photographs as reconstruction source data.

The default application route is a procedural architectural study. Technical Spark/RAD/PlayCanvas routes remain available through query parameters.

## Product decision

Field clearance is preserved, not abandoned.

The order is now:

```text
synthetic visual feasibility
        ↓
realism/material iteration
        ↓
product-value decision
        ↓
only if justified:
written field clearance
        ↓
partial real capture
```

This avoids spending time on external permission work before the experience has demonstrated enough visual/product value.

## Reference basis

The synthetic model uses publicly documented Boudhanath characteristics as approximate visual constraints, including:

- the large white hemispherical dome;
- the square harmika with Buddha eyes on four sides;
- the thirteen-stage upper spire;
- gilded upper elements;
- radial prayer flags;
- circumambulatory/plaza context;
- monument scale in the low-forty-meter range.

These references constrain silhouette and proportion only.

The model must not be described as survey-accurate, measured reconstruction, conservation documentation, or a digital twin.

## Phase 3P.1 — Composition baseline

### Implemented

- full-screen default experience;
- approximate real-world monument scale;
- stepped plinth;
- white weathered dome;
- articulated dome-base ring;
- four procedural Buddha-eye panels;
- gilded harmika;
- thirteen stepped spire levels;
- upper canopy/umbrella layers;
- pinnacle;
- prayer-wheel ring;
- ten radial prayer-flag lines;
- animated individual flags;
- stone courtyard;
- circular kora path;
- surrounding multi-storey courtyard façades;
- shopfronts, awnings, windows, parapets, and cornice bands;
- warm/cool directional lighting;
- atmospheric fog;
- procedural sky;
- cinematic entry camera;
- orbit and zoom;
- reduced-motion behavior;
- responsive editorial UI;
- explicit “Synthetic study · no scan data” disclosure.

## Technical isolation

Default route:

```text
/
```

Synthetic visual prototype.

Engineering routes remain:

```text
?renderer=spark
?renderer=rad
?renderer=playcanvas
```

The visual prototype does not replace or weaken the proven reconstruction pipeline.

## Verification

Phase 3P.1 branch verification includes:

- locked dependency install;
- unit tests;
- TypeScript/Vite production build;
- default-route Chromium readiness probe;
- default-route screenshot artifact;
- Spark runtime regression;
- PlayCanvas runtime regression;
- RAD-pipeline regression.

The second-pass screenshot was reviewed visually after CI capture.

## Visual assessment

### Working well

- silhouette immediately reads as Boudhanath;
- monument scale dominates the frame correctly;
- cinematic camera composition is strong;
- radial flags add recognizable motion/depth;
- white/gold/warm-earth palette is directionally convincing;
- surrounding façades create a usable plaza enclosure;
- editorial overlay feels like a finished experience rather than a debug viewer.

### Still visibly synthetic

- geometry remains too clean and mathematically regular;
- façade materials are procedural rather than photographic/PBR;
- dome plaster lacks high-frequency cracks, stains, repairs, and local variation;
- eye/harmika artwork is simplified;
- upper spire lacks the irregularity and ornament density of the real monument;
- plaza architecture is representative, not site-accurate;
- no physically based environment map;
- no people/pigeons/incense/ritual movement;
- no real atmospheric light capture;
- no occlusion/detail complexity from a true reconstruction.

## Phase 3P.1 verdict

**Successful as a visual-feasibility baseline.**

It is good enough to justify continuing synthetic visual development.

It is **not** realistic enough to justify triggering field-clearance work yet.

That is intentional: the next phase should test how far the synthetic approach can be pushed before we decide a real capture is necessary.

## Next phase

### Phase 3P.2 — Realism and material pass

Focus only on visible realism:

- higher-quality plaster variation;
- better gold/copper response;
- richer architectural detail;
- more accurate eye/harmika treatment;
- roof/cornice/wood detail;
- atmospheric depth;
- controlled imperfections;
- better camera focal composition;
- environment lighting;
- optional legally reusable/generative texture assets where provenance is clear.

Do not add cultural hotspots, audio, first-person navigation, or real field-capture data in 3P.2.

## Exit question for Phase 3P.2

After the next screenshot review, answer:

> Does the synthetic result feel strong enough that a real Boudhanath reconstruction would clearly produce a portfolio/public experience worth the capture and permission effort?

If no, continue or reconsider the visual direction.

If yes, reactivate Phase 3C.2 field clearance.
