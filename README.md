# YJH's Iceland Volcano Simulator

A browser-based scientific prototype for studying the 2010 Eyjafjallajökull ash dispersal event.

## Current status

This repository starts with the application shell, interactive globe, configurable reconstruction/experiment modes, city alert panel, statistics export scaffolding, and a clearly-labelled **synthetic demonstration solver**.

**Scientific-data warning:** the demonstration solver is not a reconstruction of the 2010 event. Do not interpret its output as observed or validated ash concentrations. The production solver must ingest archived ERA5 pressure-level fields and documented eruption source data before scientific use.

## Stack

- React + TypeScript + Vite
- MapLibre GL JS
- Three-dimensional Eulerian ash concentration state (prototype)
- Web Worker-ready simulation architecture
- Browser-side JSON/CSV export scaffolding

## Run locally

```bash
npm install
npm run dev
```

## Planned scientific implementation

1. ERA5 pressure-level and surface meteorological data ingestion.
2. Resumable, tiled download manifest with checksums and provenance.
3. Spherical grid geometry and vector-based wind interpolation.
4. Conservative finite-volume advection, diffusion and sedimentation.
5. Size-bin-resolved mass concentration fields and deposition budgets.
6. 30-minute diagnostics and reproducible experiment manifests.
7. Validation against satellite, lidar, VAAC and deposition observations.

## Data provenance

Every production dataset must record its provider, product, grid, temporal coverage, units, retrieval timestamp, license and checksum. Missing data must never be silently replaced with fabricated observations.
