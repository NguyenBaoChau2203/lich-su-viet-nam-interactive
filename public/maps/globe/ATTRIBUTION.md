# Globe Surface Imagery and Rendering Attribution

This directory contains the local, versioned Earth surface texture set prepared in Phase 0 and used by the integrated cinematic history homepage (`public/maps/globe/`). Image rights and geographic-data rights are distinct from the rendering code licenses below. Local dimensions, bytes and SHA-256 values were rechecked in P6 on 2026-10-24; the publisher's texture permission and Natural Earth terms were also re-opened on that date. Original acquisition/access dates remain unchanged in `assets.provenance.json`.

## 1. Planetary Surface Textures (CC BY 4.0)

- **Creator / Publisher:** Solar System Scope (invented and developed by INOVE)
- **Source Catalog:** <https://www.solarsystemscope.com/textures/>
- **Access Date:** 2026-10-23
- **License:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Publisher License Statement:** *"Distributed under Attribution 4.0 International license: You may use, adapt, and share these textures for any purpose, even commercially."*

### Acquired Local Files and Documented Transformations

1. `earth-day-4096x2048.jpg` (4096×2048, 604,686 bytes, SHA-256: `dd19f035724ef42464c89a4feb0d46ad4cbdf9fa591fed9bf4c861768e16cfa2`)
   - **Upstream file:** `https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg` (8192×4096 JPEG, 4,565,076 bytes, SHA-256: `88ab060b6e7d241cfc590c69f528fab2b3247b738d40124cb590999a6fe44abc`)
   - **Adaptation note (per CC BY 4.0):** Downscaled 2:1 from 8192×4096 to 4096×2048 with Lanczos3 filtering and re-encoded as MozJPEG (quality 84) using `sharp@0.35.5`. No geographic warping or label additions.
2. `earth-normal-2048x1024.jpg` (2048×1024, 74,177 bytes, SHA-256: `8cb5fd182d1647104825de7f62a441fea00eb0f45e0a68aeb7b37d6792d2f0a5`)
   - **Upstream file:** `https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.tif` (2048×1024 TIFF, 521,376 bytes, SHA-256: `f518ce2646ca935dbc17e316041de4fea7a5da0ec441e4eb22e711eabd843ba2`)
   - **Adaptation note (per CC BY 4.0):** Converted from TIFF to browser-compatible 4:4:4 MozJPEG (quality 92) at native 2048×1024 resolution using `sharp@0.35.5`.
3. `earth-specular-2048x1024.jpg` (2048×1024, 133,396 bytes, SHA-256: `465ce53d3185694ce0878b97e7a4a2a1b39e14f6522dbd8717a08b93bbd321f7`)
   - **Upstream file:** `https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.tif` (2048×1024 TIFF, 338,524 bytes, SHA-256: `6b90ecfce248591a1ecc9a3e49acca1a7059b6828877e718302ed9a6b4471bd7`)
   - **Adaptation note (per CC BY 4.0):** Converted from TIFF to browser-compatible MozJPEG (quality 85) at native 2048×1024 resolution using `sharp@0.35.5`.

## 2. Geographic Vectors (Retained from `public/maps/`)

- `public/maps/vietnam-tabletop.geojson` and `public/maps/history-world-land.geojson` derive from **Natural Earth v5.1.2** (Public Domain / CC0 1.0 Universal). See `public/maps/vietnam-tabletop.provenance.json` and `public/maps/history-world-land.provenance.json` for full provenance and cartographic scale disclosures.
- `public/maps/history-country-boundaries.geojson` derives from **Natural Earth 50m Admin 0 boundary lines (land)**, layer catalog version 5.1.0 from repository snapshot tag `v5.1.2` (Public Domain / CC0 1.0 Universal). It contains only ordinary international land boundaries under classification policy `FCLASS_VN ?? FEATURECLA`, omitting disputed, control, indefinite, indeterminant, subnational, and unrecognized lines. See `public/maps/history-country-boundaries.provenance.json` for full provenance, omitted classes inventory, and cartographic scale disclosures.

## 3. Referenced Open-Source Code Patterns (MIT)

- **Three.js** (`mrdoob/three.js`, MIT License, <https://github.com/mrdoob/three.js/blob/dev/LICENSE>): Earth Fresnel/limb atmospheric shading concepts adapted from [`examples/webgpu_tsl_earth.html`](https://github.com/mrdoob/three.js/blob/bae834d3558321fd3b38200735eebfb6acb5e149/examples/webgpu_tsl_earth.html).
- **three-globe** (`vasturiano/three-globe`, MIT License, Copyright (c) 2019 Vasco Asturiano, <https://github.com/vasturiano/three-globe/blob/master/LICENSE>): Installed at `2.45.6`, using the same npm `three@0.186.1` peer instance. `lib/explorer/cinematic/geography.ts` uses its spherical polygon builder, copies the cap geometry, then destroys the temporary builder. The custom-material example supplied a layering reference ([`example/custom-material/index.html`](https://github.com/vasturiano/three-globe/blob/99d7cda5a2703e7b2cce6cdf5adf5eace02c59db/example/custom-material/index.html)); it did not supply the Earth images.

The installed Three.js MIT notice is Copyright © 2010–2026 three.js authors; the installed three-globe MIT notice is Copyright (c) 2019 Vasco Asturiano. Keep those package notices with redistributed code. The local shader header records conceptual adaptation of the examples into classic GLSL; it does not relicense Solar System Scope imagery under MIT. Spherical geometry helpers retain their own MIT package notices. Stars are procedural, and the generated concept PNG is a documentation reference rather than a runtime texture or geographic source.
