# Third-Party Visual Assets

MaybeBoudha's application code and synthetic geometry are separate from third-party visual reference material.

## Phase 3P eye-facade texture

The synthetic Boudhanath visual feasibility study optionally uses a cropped view of this photograph on the four synthetic eye panels:

- File: `Boudha eyes.jpg`
- Author: **Christopher J. Fynn**
- Source: Wikimedia Commons
- Source page: https://commons.wikimedia.org/wiki/File:Boudha_eyes.jpg
- License: **Creative Commons Attribution-ShareAlike 4.0 International**
- License: https://creativecommons.org/licenses/by-sa/4.0/

The project does not claim ownership of that photograph.

### How it is used

The prototype loads the Wikimedia-hosted preview at runtime and crops the eye/façade area with texture coordinates.

Only the synthetic eye-panel planes use the photographic crop.

The upper spire, dome, flags, courtyard, surrounding architecture, lighting, and all geometry remain synthetic/procedural.

If the remote image cannot load, the eye panels fall back to the procedural texture.

No Boudhanath field-capture or scan data is included.

### Share-alike note

Any extracted/cropped texture derived from the image remains subject to CC BY-SA 4.0.

Do not copy that texture into a differently licensed proprietary asset package without preserving the required attribution/share-alike terms.

## MiniWorld3D Boudhanath geometry

Phase 3P uses the Boudhanath STL supplied from the MiniWorld3D Pinshape listing as the default visual-study monument geometry.

- Creator: **MiniWorld3D / Dany Sánchez**
- Source listing: https://pinshape.com/items/5106-3d-printed-boudhanath-stupa
- License shown by the source listing: **Creative Commons Attribution (CC BY)**
- Original file: `Boudha.STL`
- Original bytes: **727,784**
- Original SHA-256: `26056855d10d51b9af31bf75cd7eebca0ab161a70c8aeafb664b7e0df621d5e9`
- Triangles: **14,554**
- Indexed vertices used by the browser package: **7,281**

### Transformation

The original printable mesh is converted into a compact browser package.

The browser representation preserves the mesh topology but quantizes positions and adapts the model's X/Z footprint and Y height independently for this visual-feasibility scene.

That non-uniform scale correction is intentional because the printable STL's raw 108 × 54.4 × 108 proportions do not correspond to the real monument's intended visual scale.

Therefore this model remains an **artistic/reference geometry**, not survey-grade or capture-derived geometry.

Attribution must remain with any distribution or derivative use that requires it under the source license.


## Photographic Boudhanath surroundings

Phase 3P uses a public-domain panorama as optional photographic context around the interactive 3D monument:

- File: `P37275-Kathmandu-Boudhanath.jpg`
- Author: **Xiquinho**
- Source: Wikimedia Commons
- Source page: https://commons.wikimedia.org/wiki/File:P37275-Kathmandu-Boudhanath.jpg
- Status: **public domain / PD-self**
- Original dimensions: **12,225 × 2,903**
- Project runtime preview: Wikimedia 2,560 px derivative

The source description identifies it as a panorama taken from Boudhanath stupa showing surrounding shops and temples.

### How it is used

The image is mapped onto an inward-facing cylindrical environment around the interactive scene.

When the photograph loads successfully:

- the procedural surrounding-building group is hidden;
- the central Boudhanath monument remains interactive 3D geometry;
- the courtyard/environment gains real photographic architectural context.

If the photograph fails to load, the procedural surroundings remain visible.

The panorama is contextual imagery only. It is not reconstruction source data and does not convert the synthetic/hybrid monument into a scan or digital twin.


## Point-cloud candidate — not yet imported

A Phase 3P.3 candidate has been identified:

- title: `BOUDHANATH STUPA - POINTCLOUD`
- author: Enea Le Fons / `@enealefons`
- source: Sketchfab
- model page: https://sketchfab.com/3d-models/boudhanath-stupa-pointcloud-ba7da7bbf6cc4ce9ab17ce66bc9597a1
- public listing: approximately **100k vertices**, **0 triangles**
- license: **Creative Commons Attribution**
- status: downloadable
- restriction: **NoAI**

This asset is **not yet included** in MaybeBoudha.

If imported:

1. preserve the original archive/file and source metadata outside derived browser assets;
2. record SHA-256;
3. retain author attribution;
4. do not use it for AI training, model development, or generative-AI input;
5. document all format/scale/color conversions;
6. do not assume it is survey-grade simply because it is a point cloud.
