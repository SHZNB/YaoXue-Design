# Scientific Rigor Enhancement Spec

## Why
To meet academic and industry standards, the platform needs to move beyond simple simulations to rigorous scientific experimentation. This includes structured experimental design, data collection, and reproducibility verification.

## What Changes
- **Database**: Add tables for protocols, variables, and data collection templates.
- **UI**: Add "Lab Guide" (protocols), "Design" (hypothesis/variables), and "Notebook" (data collection) modules to `LabContainer`.
- **Components**: Enhance existing labs to support "Control Group" mode.

## Impact
- **Affected specs**: `verify-and-fix-lab-platform` (needs updates to verify new features).
- **Affected code**: `LabContainer.tsx`, `types/lab.ts`, database schema.

## ADDED Requirements
### Requirement: Experimental Design
The system SHALL allow students to define:
- Hypothesis
- Independent Variables (what they change)
- Dependent Variables (what they measure)
- Controlled Variables (what they keep constant)

### Requirement: Step-by-Step Protocol
The system SHALL display a structured, interactive guide for experiment steps, allowing users to check off completed actions.

### Requirement: Data Collection & Comparison
The system SHALL provide a "Lab Notebook" to:
- Record data points (manual or auto-captured from simulation).
- Compare "Control Group" vs "Experimental Group" data.
- Visualize results (basic charts).

### Requirement: Reproducibility
The system SHALL record the exact simulation parameters (seed, initial state) to allow re-running the experiment to verify results.

## MODIFIED Requirements
### Requirement: LabContainer Layout
The `LabContainer` layout will be updated to include tabs for "Guide", "Design", "Simulation", and "Notebook".
