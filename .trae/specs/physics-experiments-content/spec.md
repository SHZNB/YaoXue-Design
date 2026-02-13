# Physics Experiments Content Spec

## Why
The current Physics lab is a generic "Draggable Box" demo. To provide educational value, we need specific, scientifically accurate experiments: Free Fall, Pendulum, and Circuit Analysis.

## What Changes
- **New Components**:
    - `experiments/physics/FreeFall.tsx`
    - `experiments/physics/Pendulum.tsx`
    - `experiments/physics/Circuit.tsx`
- **Modified**: `experiments/PhysicsLab.tsx` will act as a router/selector for these sub-experiments based on `experimentId` or configuration.
- **Data Integration**: Connect these new experiments to the `DataCollector` and `LabGuide` introduced in `scientific-rigor-enhancement`.

## Impact
- **Affected specs**: `scientific-rigor-enhancement` (integration point).
- **Affected code**: `src/experiments/PhysicsLab.tsx` (major refactor).

## ADDED Requirements
### Requirement: Free Fall Experiment
- **Visuals**: A ball dropping from a configurable height.
- **Controls**: Height slider, Mass slider, Gravity slider (Earth/Moon/Mars).
- **Output**: Real-time velocity/position graphs, impact time.

### Requirement: Pendulum Experiment
- **Visuals**: A swinging pendulum.
- **Controls**: String length, Bob mass, Release angle.
- **Output**: Period timer, Phase space plot.

### Requirement: Circuit Experiment
- **Visuals**: 2D/3D schematic with battery, resistor, LED, switch.
- **Interactions**: Drag components, wire connections, toggle switch.
- **Output**: Voltmeter/Ammeter readings, Ohm's Law verification.

## MODIFIED Requirements
### Requirement: PhysicsLab Routing
`PhysicsLab.tsx` SHALL inspect the `experiment` metadata (specifically `title` or `content_url`) to render the correct sub-component.
