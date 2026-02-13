# Experiment QA and Enhancement Spec

## Why
The experiment library has been expanded with 9 new components across Chemistry, Biology, and Geography. To ensure these are production-ready, we need a rigorous Quality Assurance (QA) phase. The user explicitly requested to "perfect content" and "check code three times," implying a need for high reliability, full internationalization (i18n), and comprehensive testing.

## What Changes
- **I18n**: Replace ALL hardcoded text in experiment components with `react-i18next` keys.
- **Testing**: Create dedicated unit tests (`.test.tsx`) for all 9 sub-experiment components and the 3 main lab containers.
- **Storybook**: Ensure every experiment component has a corresponding Storybook story for visual verification.
- **Code Quality**: Fix all linting errors and type issues (`any` usage).
- **Functionality**: Verify that every interactive element (sliders, buttons) updates state and logs the action.

## Impact
- **Affected Code**: `src/experiments/**/*.tsx`, `src/locales/*.json`.
- **Affected Specs**: Builds upon `experiments-content-completion`.

## ADDED Requirements
### Requirement: Comprehensive Test Coverage
The system SHALL provide unit tests for every experiment component with >80% coverage.
- **Scenario**: User interacts with "Add Acid" in Titration.
- **Then**: State updates, UI reflects change, and `logAction` is called.

### Requirement: Full Internationalization
The system SHALL NOT display any hardcoded strings in the experiment UI. All text must be loaded via `t()`.

### Requirement: Visual Documentation
The system SHALL provide Storybook stories for all 12 experiment components (3 main + 9 sub).

## MODIFIED Requirements
### Requirement: Experiment Logic
Refine the simulation logic (e.g., Genetics Punnett Square, Photosynthesis rate) to be more scientifically accurate where possible within the UI constraints.
