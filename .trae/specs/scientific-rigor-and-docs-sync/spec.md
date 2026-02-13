# Scientific Rigor & Storybook Sync Spec

## Why
The user identified that current experiments lack strict scientific design (variables, data collection) and Storybook documentation is inconsistent with the actual app. We need to standardize data collection across all experiments and ensure Storybook reflects the latest state.

## What Changes
1.  **Shared UI**: Create `ExperimentDataPanel` component to handle data recording and display.
2.  **Experiment Logic**:
    -   Update all 12 experiments to include explicit "Record Data" functionality.
    -   Ensure independent/dependent variables are clearly exposed and controllable.
3.  **Storybook**:
    -   Update all 12 stories to use the new components.
    -   Fix any arg discrepancies.

## Impact
-   **Affected Files**: `src/experiments/**/*.tsx`, `src/stories/experiments/**/*.stories.tsx`.
-   **New Component**: `src/components/lab/ExperimentDataPanel.tsx`.

## ADDED Requirements
### Requirement: Data Collection
Every experiment SHALL allow the user to record data points (manually or automatically) into a local table.
-   **Scenario**: Student changes variable X, observes Y, clicks "Record".
-   **Then**: Data (X, Y) appears in a list/table within the simulation view.

### Requirement: Scientific Controls
Every experiment SHALL clearly label "Independent Variables" (Controls) and "Dependent Variables" (Observations).

### Requirement: Storybook Consistency
Storybook stories SHALL render the exact same component as the app, with no fake text or broken layouts.
