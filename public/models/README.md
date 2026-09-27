# Prototype model assets

This directory contains the compact browser representation of the Boudhanath model supplied for Phase 3P.

## Source model

Original archive:

`boudhanath-stupa-by-miniworld3d.zip`

Original model:

`Boudha.STL`

Creator/source attribution:

- MiniWorld3D / Dany Sánchez
- Pinshape listing: https://pinshape.com/items/5106-3d-printed-boudhanath-stupa
- license shown by the source listing: Creative Commons Attribution (CC BY)

Original STL verification:

- bytes: **727,784**
- triangles: **14,554**
- unique vertices after indexing: **7,281**
- watertight mesh: **yes**
- source SHA-256: `26056855d10d51b9af31bf75cd7eebca0ab161a70c8aeafb664b7e0df621d5e9`

## Browser payload

The STL is not shipped verbatim.

For the visual prototype it is converted into a compact `MBV2` package:

- duplicate STL vertices are indexed;
- positions are quantized to 16-bit coordinates;
- triangle topology is preserved;
- the package is gzip compressed;
- the base64 payload is split into four static chunks under `public/models/boudha/`.

The browser:

1. loads all four chunks;
2. concatenates/base64-decodes them;
3. gunzips the payload;
4. validates the `MBV2` header/counts/bounds;
5. rebuilds the indexed Three.js geometry;
6. recomputes normals;
7. adapts the printable-model proportions for the visual study.

This conversion is intended for browser delivery, not archival replacement. The original STL remains the provenance/master reference outside the repository.

## Product use

The uploaded MiniWorld3D geometry is now the **default Phase 3P monument geometry**.

Use:

```text
/                    # uploaded licensed model
/?model=licensed     # explicit licensed-model route
/?model=procedural   # previous procedural comparison/fallback
```

The geometry is a printable artistic model, not survey-grade reconstruction data. It must never be described as a scan or measured digital twin.
