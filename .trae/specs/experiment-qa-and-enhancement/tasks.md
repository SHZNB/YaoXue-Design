# Tasks

- [x] Task 1: Internationalization (I18n) Standardization
    - [x] Create/Update `src/locales/zh.json` (and `en.json`) with keys for all experiments.
    - [x] Refactor `ChemistryLab.tsx` and its sub-components (`Titration`, `FlameTest`, `Electrolysis`) to use `t()`.
    - [x] Refactor `BiologyLab.tsx` and its sub-components (`Microscope`, `Photosynthesis`, `Genetics`) to use `t()`.
    - [x] Refactor `GeographyLab.tsx` and its sub-components (`Volcano`, `WaterCycle`, `PlateTectonics`) to use `t()`.
    - [x] Refactor `PhysicsLab.tsx` and its sub-components (`FreeFall`, `Pendulum`, `Circuit`) to use `t()`.

- [x] Task 2: Unit Testing Expansion
    - [x] Create `experiments/chemistry/__tests__/Titration.test.tsx`
    - [x] Create `experiments/chemistry/__tests__/FlameTest.test.tsx`
    - [x] Create `experiments/chemistry/__tests__/Electrolysis.test.tsx`
    - [x] Create `experiments/biology/__tests__/Microscope.test.tsx`
    - [x] Create `experiments/biology/__tests__/Photosynthesis.test.tsx`
    - [x] Create `experiments/biology/__tests__/Genetics.test.tsx`
    - [x] Create `experiments/geography/__tests__/Volcano.test.tsx`
    - [x] Create `experiments/geography/__tests__/WaterCycle.test.tsx`
    - [x] Create `experiments/geography/__tests__/PlateTectonics.test.tsx`
    - [x] Create `experiments/__tests__/GeographyLab.test.tsx`
    - [x] Create `experiments/__tests__/PhysicsLab.test.tsx`

- [x] Task 3: Storybook Coverage
    - [x] Ensure `.stories.tsx` files exist for all 9 sub-experiments in `src/stories/experiments/`.

- [x] Task 4: Code Quality & "Triple Check"
    - [x] Run `npm run lint` and fix all reported issues in `src/experiments`.
    - [x] Run `npm run check` (TypeScript) and fix all type errors.
    - [x] Verify `logAction` is present in all interactive handlers across all files.

# Task Dependencies
- Task 2 depends on Task 1 (tests should expect translated strings or mock i18n).
- Task 4 can be done iteratively but final check must be last.
