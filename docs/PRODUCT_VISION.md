# Product Vision

## Working title

**MaybeBoudha**

The title is intentionally provisional. The project should not couple routes, code structure, asset names, or metadata to a final brand name.

## Vision

Create a browser experience that makes Boudhanath feel present rather than merely displayed.

A visitor should be able to arrive at the site, see a convincing representation of the real monument, move through a carefully composed introduction, explore the scene, and optionally learn about important architectural and cultural details without the interface overwhelming the place itself.

## Product statement

MaybeBoudha is a **photorealistic interactive digital heritage experience**, not:

- a normal tourism landing page;
- a static image gallery;
- a generic Three.js demo;
- a game;
- a replacement for visiting Boudhanath;
- a claim to be a survey-grade or archival digital twin.

The phrase "digital twin" should only be used publicly later if the capture quality, measurement accuracy, provenance, and maintenance process justify it.

## Experience principles

### 1. Presence before UI

The monument is the primary interface.

The first impression should be spatial and visual. Navigation, labels, panels, and controls should appear only when useful.

### 2. Reality before decoration

Real-scene reconstruction quality matters more than adding particles, shaders, or heavy motion.

If the captured scene is not convincing, more effects will not solve the core problem.

### 3. Guided first, exploratory second

The first visit should have a short cinematic composition so the user immediately understands what they are seeing.

After that, the user can take control.

### 4. Respectful storytelling

Cultural, religious, architectural, and historical material must be sourced carefully and presented without turning sacred details into game mechanics.

### 5. Progressive fidelity

The experience must still work when the highest-quality reconstruction cannot be loaded.

Desktop and high-bandwidth users may receive a richer scene. Mobile and constrained users should receive a lighter representation rather than a broken page.

### 6. Calm interaction

Motion should be intentional. Avoid aggressive scroll hijacking, constant floating UI, excessive glow, or interaction that competes with the Stupa.

## Primary user journey

1. Visitor opens the site.
2. A lightweight shell appears immediately.
3. The page communicates that a 3D experience is loading.
4. A low-cost preview appears before the full-quality scene when possible.
5. A short cinematic camera introduction establishes Boudhanath.
6. Control is handed to the visitor.
7. The visitor can orbit, zoom, or follow guided viewpoints.
8. Optional hotspots explain selected details.
9. The visitor can enter a guided story or continue exploring.
10. The experience remains usable on mobile and with reduced motion enabled.

## MVP

The first meaningful release should include:

- one reconstructed Boudhanath scene;
- cinematic initial camera movement;
- orbit / zoom interaction;
- responsive UI;
- loading progress and recovery states;
- 3–5 carefully selected informational hotspots;
- keyboard and touch support where applicable;
- reduced-motion behavior;
- mobile quality fallback;
- basic ambient audio with explicit user control;
- production deployment.

## Later possibilities

These are explicitly **not MVP requirements**:

- first-person walking;
- time-of-day transitions;
- historical scene comparison;
- archival-photo overlays;
- multilingual content;
- guided narrated tours;
- dynamic crowds;
- animated prayer flags;
- spatial audio;
- VR / WebXR;
- multiple Kathmandu heritage locations;
- user accounts;
- CMS / admin interface.

They should only be introduced when the core experience is stable.

## Content boundaries

The project should separate factual/cultural content from scene code.

Hotspot data should eventually live in a structured content layer containing fields such as:

- stable ID;
- title;
- short description;
- long description;
- source references;
- scene position / target;
- camera preset;
- media;
- locale.

This keeps cultural content reviewable without touching rendering logic.

## Capture and provenance requirements

Before publishing a real reconstruction, record:

- who captured or supplied the imagery;
- when it was captured;
- what processing pipeline was used;
- what areas are incomplete or reconstructed poorly;
- what usage rights apply;
- whether identifiable people or private details need removal;
- whether aerial capture was used and under what permission;
- which parts are reconstructed versus manually modeled.

The project should never imply more accuracy than the source data provides.

## Success criteria

The project is successful when:

1. a new visitor understands what the experience is without instructions;
2. the first meaningful visual appears quickly enough that users do not abandon the page;
3. the real scene looks convincingly spatial rather than like a textured low-detail model;
4. navigation feels stable and does not cause motion sickness;
5. mobile users get a deliberate fallback rather than a degraded desktop experience;
6. scene assets can be replaced independently from application code;
7. cultural information is sourced and reviewable;
8. the final experience is strong enough to stand as a serious portfolio project rather than a one-off graphics demo.
