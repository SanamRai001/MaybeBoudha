# Phase 3P.7D — Ambient Sound and Release Readiness

## Purpose

Phase 3P.7D adds the final optional sensory layer to the current synthetic MaybeBoudha prototype and prepares the browser shell for a public prototype release.

The phase does **not** change monument/source geometry and does not restart field capture work.

## Ambient sound decision

MaybeBoudha does not use a downloaded or claimed on-site recording.

The prototype generates a restrained abstract ambience in the browser with the Web Audio API.

The generated layer contains:

- deterministic filtered noise;
- high-pass filtering;
- low-pass filtering;
- very slow low-frequency gain modulation;
- no bells;
- no chanting;
- no speech;
- no recorded crowds;
- no recorded traffic;
- no external audio file.

This avoids both licensing ambiguity and the false implication that the sound represents an authentic Boudhanath field recording.

## Playback policy

Audio is:

- **off by default**;
- created only after explicit user activation;
- controlled by a visible button;
- exposed through `aria-pressed`;
- faded in/out rather than hard switched;
- suspended when the document is hidden;
- resumed only when the document becomes visible again **and** the user had previously enabled it;
- destroyed when the prototype unmounts.

The page does not contain an autoplaying `<audio>` element.

UI states:

```text
Sound off
Sound on
Sound paused
Sound unavailable
```

## Browser proof

PR:

`#14 — feat: Phase 3P.7D ambient sound and release readiness`

Implementation head:

`e97313ad94137db2ff544af0ba2e45ffbc3fd125`

Green:

- CI **#239**
- RAD Pipeline **#133**
- Surface Reconstruction **#42**

### Audio keyboard proof

Chromium started with:

```text
state = off
aria-pressed = false
autoplayAudio = false
```

The Sound control was focused and activated through a real Enter keyboard event.

Result:

```text
state = on
aria-pressed = true
```

A second Enter activation returned it to:

```text
state = off
aria-pressed = false
```

The proof therefore verifies opt-in behavior rather than simply mutating React state directly.

## Mobile proof

Viewport:

`390 × 844`

Verified:

- `innerWidth = 390`;
- `scrollWidth = 390`;
- no horizontal overflow;
- Sound control visible;
- Reset control visible;
- Focus control visible;
- touch orbit still enters `explore`;
- reset still returns to `home`.

The added audio button does not require a separate mobile interface.

## Reduced-motion proof

Reduced-motion behavior remains unchanged:

- camera starts/returns at the home state;
- the UI reports Reduced motion;
- camera/reset interaction remains available;
- audio remains independent of motion preference and stays opt-in.

## Release metadata

The application shell now includes:

- clearer production-style page title;
- honest description identifying the project as an interactive synthetic visual study;
- Open Graph title/description/type;
- Twitter summary metadata;
- theme/color-scheme metadata;
- `site.webmanifest`;
- `robots.txt`.

The metadata intentionally does **not** include:

- a canonical URL;
- `og:url`;
- a production `og:image`.

Those values depend on the actual deployment URL and final hosted preview image and should not be invented before deployment.

## Portfolio media

CI continues to generate deterministic screenshots for:

- desktop prototype;
- 390 × 844 mobile prototype;
- reduced-motion prototype;
- uploaded model route;
- point-cloud engineering route;
- Spark/PlayCanvas regression views.

Phase 3P.7D reviewed the desktop and mobile prototype screenshots directly.

### Desktop review

Accepted:

- Sound / Reset / Focus controls remain visually balanced;
- monument composition is unchanged;
- photographic environment remains coherent;
- sound defaults to off in the portfolio capture.

### Mobile review

Accepted:

- all three controls remain reachable;
- no overflow;
- monument remains dominant;
- title/copy/status remain readable;
- audio control does not obscure the monument or story.

## Audio provenance

No third-party audio asset exists.

The procedural-audio provenance is recorded in:

`docs/THIRD_PARTY_ASSETS.md`

The generated ambience must not be presented as real Boudhanath sound.

## Release-readiness checklist

### Ready

- [x] honest synthetic/no-scan disclosure;
- [x] responsive desktop/mobile presentation;
- [x] keyboard-visible controls;
- [x] reduced-motion behavior;
- [x] camera reset/home state;
- [x] touch orbit proof;
- [x] device-aware renderer quality;
- [x] runtime quality/FPS telemetry;
- [x] opt-in audio;
- [x] no audible autoplay;
- [x] audio provenance;
- [x] visual-asset provenance;
- [x] page description/title;
- [x] Open Graph/Twitter descriptive metadata;
- [x] web manifest;
- [x] robots policy;
- [x] deterministic portfolio screenshot artifacts;
- [x] engineering renderer/RAD/source regressions preserved.

### Requires actual deployment context

- [ ] production URL;
- [ ] canonical URL;
- [ ] `og:url`;
- [ ] hosted social-preview image and `og:image`;
- [ ] deployment-specific cache/header review;
- [ ] production-host smoke test.

### Requires physical hardware before performance claims

- [ ] real desktop GPU profiling;
- [ ] real phone FPS;
- [ ] real phone memory/battery behavior.

## Field-capture status

Unchanged:

**NO-GO for field capture right now.**

Phase 3C.2 remains prepared but deferred.

No permission outreach was sent by this phase.

## Decision

**Phase 3P.7D implementation is accepted as a release candidate layer.**

The current synthetic prototype is ready for a deployment-specific pass without additional monument/source experiments.

## Next

### Phase 3P.7E — Public prototype deployment and portfolio packaging

Before publishing:

1. choose the actual hosting target;
2. deploy the current release candidate without changing monument geometry;
3. add canonical / `og:url` from the real URL;
4. publish a social-preview image;
5. verify production caching/asset delivery;
6. run production URL desktop/mobile smoke;
7. capture final portfolio media;
8. keep the synthetic/no-scan disclosure prominent.

Do not restart field capture or source-geometry experiments as part of deployment.
