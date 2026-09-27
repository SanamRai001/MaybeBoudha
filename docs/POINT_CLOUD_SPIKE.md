# Phase 3P.3 — Licensed Boudhanath Point-Cloud Spike

## Purpose

Test whether an already-existing licensed Boudhanath point cloud can provide the realism jump that the Phase 3P.2 hybrid scene cannot reach through further hand-modeling.

This phase intentionally happens **before** reactivating field-clearance outreach.

## Candidate

Sketchfab model:

`BOUDHANATH STUPA - POINTCLOUD`

Model page:

https://sketchfab.com/3d-models/boudhanath-stupa-pointcloud-ba7da7bbf6cc4ce9ab17ce66bc9597a1

Known public-listing metadata:

- model UID: `ba7da7bbf6cc4ce9ab17ce66bc9597a1`
- author: Enea Le Fons / `@enealefons`
- approximately 100k vertices
- 0 triangles
- downloadable
- Creative Commons Attribution
- NoAI restriction

The model is **not yet imported** into MaybeBoudha.

## Download constraint

Sketchfab's official Download API requires an authenticated Sketchfab account before it returns the short-lived archive URL.

Do not bypass that access control.

If the current toolchain cannot authenticate as the user, the user should download the original model archive through Sketchfab and upload that archive to the conversation.

## NoAI handling

The asset may be used only as a normal 3D visual asset for this spike.

Do not use it:

- for AI training;
- for model development;
- as input to generative-AI systems;
- to create synthetic training data.

Normal deterministic file inspection, format conversion, rendering, optimization, checksums, and browser integration are allowed for the 3D product workflow.

## Original-asset intake

Before changing application code:

1. keep the downloaded archive/file unchanged;
2. record original filename;
3. record byte size;
4. compute SHA-256;
5. record download/source URL;
6. record author;
7. record license;
8. record NoAI restriction;
9. list every archive member;
10. identify the actual primary 3D format.

Do not rename or destructively rewrite the only copy of the source asset.

## Inspection questions

Determine from the actual files, not assumptions:

- Is the asset glTF/GLB, PLY, XYZ, LAS/LAZ, OBJ, or another format?
- Are points stored directly or represented as mesh vertices?
- Does each point have RGB/color?
- Are normals present?
- Are textures referenced?
- What are the coordinate bounds?
- Which axis is up?
- What is the apparent unit scale?
- Is the whole stupa present?
- Is the courtyard/environment present?
- Are there obvious capture holes/noise/outliers?
- Does it contain people/privacy-sensitive detail?
- Is the upper monument complete?
- Does it visually appear to be real capture data or merely a point-sampled authored model?

Do not call it a scan, point-cloud survey, photogrammetry result, or measured reconstruction unless source evidence and the files support that description.

## First renderer proof

Prefer the least destructive path.

### If the archive is glTF/GLB with points

Test direct Three.js loading first.

### If the archive contains PLY/XYZ-style points

Test direct Three.js `Points` rendering first.

### If conversion is required

Create a reproducible conversion script and retain the original source unchanged.

PLY is the preferred interchange target only if conversion preserves useful per-point data.

## Visual comparison

Create an explicit A/B path:

```text
current Phase 3P.2 hybrid
vs
licensed point-cloud candidate
```

Compare:

- silhouette fidelity;
- dome detail;
- harmika/eye fidelity;
- spire completeness;
- surface color realism;
- holes/noise;
- close-range quality;
- camera freedom;
- browser load size;
- browser memory;
- interaction FPS;
- compatibility with the existing Boudha courtyard environment.

The current hybrid remains the fallback until the point cloud wins this comparison.

## Technical guardrails

- do not change the production Spark/RAD decision just because this spike is a point cloud;
- do not force a point cloud into Gaussian Splat format unless that transformation is justified;
- do not overwrite the current default experience before visual review;
- do not add a large raw source archive to ordinary Git history;
- derived browser assets must retain source attribution/provenance;
- preserve the existing Spark / PlayCanvas / RAD regression gates.

## Exit criteria

Phase 3P.3 is successful when:

1. the original licensed asset is preserved and checksummed;
2. its true format/content is documented;
3. it renders in the browser;
4. a screenshot comparison against Phase 3P.2 exists;
5. its limitations are recorded;
6. a decision is made:
   - adopt the point cloud,
   - reject it and keep the hybrid,
   - or use the evidence to justify reactivating Phase 3C.2 field clearance.

## Current status

**Blocked only on obtaining the authenticated Sketchfab download archive.**
