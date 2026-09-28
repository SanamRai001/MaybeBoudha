# Boudhanath silhouette reference

This note records the visual sources and the calibration rules used by the
MaybeBoudha synthetic study.

The goal is to prevent future geometry changes from being driven by arbitrary
scale factors or by a single screenshot.

## Source hierarchy

### 1. Published dimensions

UNESCO / Nepal Department of Archaeology material records:

- total monument height: approximately **43.25 m**;
- dome diameter: approximately **120 ft**, or **36.576 m**.

Source:

https://whc.unesco.org/document/180606

The same document also mentions an approximate stupa area of 6,756 m².

**Important:** that area is not treated as a square architectural footprint.
The previous 82.2 m footprint calibration came from taking the square root of
that area. That shortcut is retired because it does not describe the actual
terrace width.

### 2. Supplied source model

The MiniWorld3D source supplied for this project is retained as useful
reference geometry for the lower terraces/base.

Its packed source proportions are approximately:

```text
108 × 54.4 × 108
```

The source remains an interpretation rather than survey geometry. It is no
longer radially deformed to force its dome into a target shape.

### 3. Real visual references

Primary side / three-quarter silhouette:

https://commons.wikimedia.org/wiki/File:Side_view_of_Boudha,Kathmandu,Nepal.JPG

Primary frontal / broad-dome reference:

https://commons.wikimedia.org/wiki/File:Boudhanath_stupa_,_Kathmandu,_Nepal.jpg

Additional frontal perspective:

https://commons.wikimedia.org/wiki/File:Boudhanath_Stupa_from_a_different_perspective.jpg

Main-entrance perspective used as a cross-check:

https://commons.wikimedia.org/wiki/File:Boudhanath_Stupa_from_main_entrance_gate.jpg

These Wikimedia Commons images are reference material only. Their individual
file pages contain the photographer and license information.

## Calibration decisions

### Dome

The dome diameter is fixed to the published 120 ft / 36.576 m value.

The visible dome is now represented as a **smooth truncated hemisphere** rather
than a manually inflated mesh or a hand-tuned chain of radius anchors.

This is grounded in architectural descriptions that explicitly call
Boudhanath's middle body a hemispherical dome. The 120 ft / 36.576 m diameter
sets the sphere radius, while the top is truncated where the circular radius
matches the working harmika width.

The three plinths are described as approximately 7 ft, 6 ft, and 6 ft high,
with a roughly 4 ft drum above them. That places the dome spring line at
approximately **7.0104 m**, replacing the older 5.15 m synthetic start height.

Supporting descriptions:

https://www.insidehimalayas.com/boudhanath-stupa/

https://greatstupa.intersearch.com.au/uploads/eBooks/Boudhanath_Stupa_Tom_Young.pdf

The resulting analytical profile is stored in:

`src/prototype/boudhaReferenceGeometry.ts`

### Terrace / base width

The previous 82.2 m value happened to be close to the real lower-plinth scale,
but its derivation from `sqrt(6,756 m²)` was invalid and remains retired.

Tevonian's 2024 Lawrence University honors project, citing Niels Gutschow,
reports the lowest plinth as **270.20 ft × 272.40 ft**.

Converted directly:

- X: **82.35696 m**;
- Z: **83.02752 m**.

MaybeBoudha now uses those two cited dimensions independently. The published
6,756 m² area is no longer used to infer a square footprint.

Source:

https://lux.lawrence.edu/luhp/188/

### Harmika

The old 7.2 m synthetic harmika was visibly too narrow.

Across the real references, the eye-bearing cube reads at roughly 30% of the
dome diameter. MaybeBoudha therefore uses a **10.8 m** working harmika width,
with a 10.0 m eye-panel width.

Again, these are visual-study calibration values, not survey claims.

## Composition rule

The default visual route now follows this hierarchy:

```text
supplied source model
    -> lower terraces / base only

published dome diameter + traced photo silhouette
    -> dome

photo-derived relative proportions
    -> harmika / eye block

existing synthetic geometry
    -> upper spire / crown

licensed / credited imagery
    -> eyes and courtyard environment
```

## Guardrail

Do not reintroduce global "make it wider" or "make it fatter" deformation
functions.

Any future silhouette change should identify:

1. the exact real reference being matched;
2. the region that differs;
3. whether the changed number is published, measured from the supplied model,
   or visually calibrated from photographs.
