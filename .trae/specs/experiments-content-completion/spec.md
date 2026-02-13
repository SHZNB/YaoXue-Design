# Experiments Content Completion Spec

## Why
Currently, only Physics has multiple sub-experiments. Chemistry, Biology, and Geography have single, somewhat generic implementations. To provide a comprehensive educational platform, each subject needs a set of specific, scientifically accurate, and interactive experiments, similar to the recent Physics upgrade.

## What Changes
- **New Components**:
    - **Chemistry**: `Titration` (Acid-Base), `FlameTest` (Metal Ions), `Electrolysis`.
    - **Biology**: `Microscope` (Cell Observation), `Photosynthesis` (Oxygen production), `Genetics` (Mendel's Peas).
    - **Geography**: `Volcano` (Eruption types), `WaterCycle`, `PlateTectonics` (Enhanced version of current GeographyLab).
- **Refactor**:
    - `ChemistryLab.tsx`, `BiologyLab.tsx`, `GeographyLab.tsx` will become routers/selectors like `PhysicsLab.tsx`.
- **Data Integration**:
    - Connect all new experiments to `logAction` and `DataCollector`.

## Impact
- **Affected specs**: `physics-experiments-content` (reference pattern).
- **Affected code**: `src/experiments/*`.

## ADDED Requirements
### Requirement: Chemistry Experiments
- **Titration**: Precise control of burette, color change indicator, PH curve plotting.
- **Flame Test**: Bunsen burner interaction, different metal salts, spectral color observation.
- **Electrolysis**: Power supply control, gas collection, electrode selection.

### Requirement: Biology Experiments
- **Microscope**: Zoom/Focus controls, slide selection (onion, cheek cells), label annotation.
- **Photosynthesis**: Light intensity/distance control, bubble counting, oxygen rate graph.
- **Genetics**: Cross-breeding UI, Punnett square visualization, probability stats.

### Requirement: Geography Experiments
- **Volcano**: Magma viscosity/gas content sliders, eruption simulation (shield vs stratovolcano).
- **Water Cycle**: Evaporation/Condensation/Precipitation interactive diagram.
- **Plate Tectonics**: Map view, plate boundary selection, earthquake/mountain formation simulation.

## MODIFIED Requirements
### Requirement: Component Routing
Each subject's main component (`ChemistryLab`, etc.) SHALL inspect the `experiment` metadata to render the correct sub-component.
