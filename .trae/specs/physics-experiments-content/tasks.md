# Tasks
- [ ] Task 1: Create Physics Sub-components
    - [ ] Implement `experiments/physics/FreeFall.tsx` (R3F + Cannon/Rapier or simple math).
    - [ ] Implement `experiments/physics/Pendulum.tsx` (R3F + simple math).
    - [ ] Implement `experiments/physics/Circuit.tsx` (2D Canvas or SVG based might be easier for circuits, but R3F is fine too).
- [ ] Task 2: Refactor PhysicsLab
    - [ ] Update `PhysicsLab.tsx` to fetch experiment details and render the matching sub-component.
    - [ ] Add "Experiment Selector" if no specific ID is provided (for dev/demo).
- [ ] Task 3: Integrate with Lab Shell
    - [ ] Connect `FreeFall` data to `DataCollector`.
    - [ ] Connect `Pendulum` period to `DataCollector`.
- [ ] Task 4: Permission & Mobile Support
    - [ ] Ensure touch events work for drag interactions (R3F usually handles this, but verify).
    - [ ] Hide "Edit Parameters" panel for students (read-only mode).

# Task Dependencies
- Task 2 depends on Task 1.
- Task 3 depends on Task 1 and `scientific-rigor-enhancement` tasks.
