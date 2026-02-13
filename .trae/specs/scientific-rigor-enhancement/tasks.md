# Tasks
- [ ] Task 1: Database Schema Extension
    - Create `experiment_variables` table (name, type, unit).
    - Create `experiment_steps` table (order, instruction, safety_warning).
    - Create `experiment_data_templates` table (columns definition).
- [ ] Task 2: UI - Lab Guide & Design
    - Implement `LabGuide` component (stepper).
    - Implement `ExperimentDesign` component (hypothesis form).
- [ ] Task 3: UI - Lab Notebook
    - Implement `DataCollector` component (table input).
    - Add "Add Control Group" functionality.
- [ ] Task 4: Integration
    - Update `LabContainer` to use tabs/split view for new components.
    - Connect `BiologyLab` (or others) to auto-fill data into the notebook.

# Task Dependencies
- Task 2 and 3 depend on Task 1.
- Task 4 depends on Task 2 and 3.
