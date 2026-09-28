# Phase 3P.7B — Camera, Interaction, Mobile and Accessibility Proof

## Purpose

Phase 3P.7B polishes interaction and responsive behavior around the strongest existing MaybeBoudha hybrid without changing monument geometry or source data.

The goal is to make the prototype feel intentionally usable rather than merely visually present.

## Product changes

### Camera handoff

The cinematic intro now has an explicit camera state:

```text
intro → home
```

If the visitor interacts before the intro finishes, the cinematic movement yields immediately:

```text
intro → explore
```

This prevents the camera animation from fighting pointer/wheel input.

### Reset / home framing

The interface now includes an explicit **Reset view** control.

Camera states:

- `intro`
- `explore`
- `resetting`
- `home`

Reset animates back to the canonical home framing in standard motion mode.

With reduced motion enabled, reset returns immediately to the home pose.

### Orbit tuning

The existing orbit interaction was retained but tuned:

- rotate speed reduced for calmer movement;
- zoom speed reduced;
- pan remains disabled;
- min/max orbit distance remains bounded;
- polar-angle constraints remain bounded;
- user interaction cancels active cinematic/reset motion.

### Focus mode keyboard behavior

The existing Focus view / Show story control remains a native button.

Chromium verification now:

1. focuses the control;
2. activates it with a real Enter keyboard event;
3. verifies `aria-pressed="true"` and focus-mode state;
4. activates it again with Enter;
5. verifies normal story view is restored.

Reset view is also activated through the keyboard during the proof.

## Mobile verification

Dedicated Chromium device emulation:

- viewport: **390 × 844**
- mobile emulation: enabled
- touch emulation: enabled
- maximum touch points: 5

Verified:

- document width: **390**
- viewport width: **390**
- no horizontal overflow;
- Focus view control is visible;
- Reset view control is visible;
- a real emulated touch drag changes camera state to `explore`;
- keyboard Reset view returns the camera to `home`.

The mobile screenshot was inspected directly.

Result:

**keep the current mobile composition.**

The monument remains intentionally dominant on the narrow viewport and the controls remain reachable without introducing a separate mobile UI.

## Reduced-motion verification

Chromium emulates:

```text
prefers-reduced-motion: reduce
```

Verified:

- media query matches;
- prototype reaches `home` without cinematic camera travel;
- footer reports `Reduced motion`;
- Reset view returns immediately to home;
- reduced-motion screenshot was inspected directly.

## Final strengthened verification

Implementation head:

`a24d31c1ac83726ab1bc65d63b8ae9835525c763`

Successful runs:

- CI **#223**
- RAD Pipeline **#123**
- Surface Reconstruction **#32**

CI #223 verified:

- locked install;
- automated tests;
- production build;
- desktop prototype;
- mobile prototype;
- reduced-motion prototype;
- uploaded MiniWorld model;
- licensed Boudhanath point cloud;
- Spark regression;
- PlayCanvas regression.

Interaction evidence from the deterministic browser probe:

```text
Focus on:
  active=true
  aria-pressed=true

Focus off:
  active=false
  aria-pressed=false

Reset:
  cameraState=home

Mobile:
  innerWidth=390
  scrollWidth=390
  focusVisible=true
  resetVisible=true

Touch:
  cameraState=explore
  reset → home

Reduced motion:
  prefersReducedMotion=true
  cameraState=home
```

## Visual review

Desktop, mobile, and reduced-motion screenshots were inspected directly.

No blocking overlap/crop regression was found.

The 390 × 844 composition is deliberately tighter than desktop, but the primary monument, heading, status, camera controls, and interaction footer remain usable.

## Guardrails

Phase 3P.7B does not:

- change monument/source geometry;
- change the Phase 3P.6 real-capture NO-GO decision;
- send permission outreach;
- add audio;
- claim the prototype is a scan or digital twin.

## Decision

**Phase 3P.7B is accepted.**

The interaction/mobile/accessibility layer is stable enough to move to the next prototype-polish subphase.

## Next

### Phase 3P.7C — Environment, atmosphere and performance polish

Focus only on:

1. prayer-flag motion quality;
2. photographic environment blending;
3. lighting/fog balance;
4. renderer pixel-ratio/quality policy;
5. simple runtime performance instrumentation;
6. screenshot-driven atmosphere review;
7. no monument-source change.

Do not add ambient sound until the visual/performance pass is stable.
