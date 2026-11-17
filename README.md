# YJH's Iceland Volcano Simulator

A browser-based scientific prototype for exploring the 2010 Eyjafjallajökull ash dispersal event.

## Run locally

```bash
npm install
npm run dev
```

## Current implementation

- React + TypeScript + Vite application shell.
- MapLibre map centered on the North Atlantic and Europe.
- Reconstruction and experiment UI modes.
- Timeline playback controls and playback-speed selector.
- City monitor for London, Paris, Frankfurt, Oslo and Stockholm.
- Layer toggles, schematic plume footprint and JSON snapshot export.
- Responsive desktop/mobile layout.

## Scientific integrity notice

**This first milestone is a user-interface prototype, not a physical simulation or a reconstruction of the 2010 event.** Plume geometry, city concentrations, altitude, dispersion range, active-cell count and trend values are synthetic placeholders. They must not be interpreted as measurements, validated model output, exposure estimates or aviation guidance.

## Planned scientific milestones

1. Ingest documented ERA5 pressure-level and surface meteorological data with provenance, units and checksums.
2. Build spherical grid geometry and interpolate wind as vector components (u/v), not wind-direction angles.
3. Implement a conservative finite-volume Eulerian solver with size-resolved ash bins, advection, diffusion, sedimentation and deposition.
4. Add a documented eruption source term and plume-rise parameterization.
5. Validate against satellite, lidar, VAAC and deposition observations.
6. Replace all synthetic display values with solver output and expose uncertainty and mass-balance diagnostics.

Production datasets must record provider, product, grid, temporal coverage, units, retrieval time, license and checksum. Missing observations must never be silently replaced with fabricated values.
