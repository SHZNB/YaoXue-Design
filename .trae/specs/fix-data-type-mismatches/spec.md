# Fix Data Type Mismatches in ExperimentDataPanel

## Why
The linter reported multiple errors where specific data interfaces (e.g., `GeneticsData`, `MicroscopeData`, `DataPoint`) are not assignable to `Record<string, unknown>[]`. This is because these interfaces lack an index signature `[key: string]: unknown`, which is implicitly required by `ExperimentDataPanel` or where the data is being passed.

## What Changes
1.  **Update Interfaces**: Add `[key: string]: unknown` index signature to all data interfaces used with `ExperimentDataPanel` in the following files:
    -   `src/experiments/biology/Genetics.tsx`
    -   `src/experiments/biology/Microscope.tsx`
    -   `src/experiments/biology/Photosynthesis.tsx`
    -   `src/experiments/physics/Circuit.tsx`
    -   `src/experiments/physics/FreeFall.tsx`
    -   `src/experiments/physics/Pendulum.tsx`

## Impact
-   **Affected Files**: 6 experiment files.
-   **Verification**: `npm run check` should pass without these specific type errors.

## ADDED Requirements
### Requirement: Type Compatibility
All data structures passed to `ExperimentDataPanel` SHALL be compatible with `Record<string, unknown>[]`.
