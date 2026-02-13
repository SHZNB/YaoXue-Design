# Tasks

- [x] Task 1: Create I18n Decorator
    - [x] Create `src/stories/decorators/I18nDecorator.tsx` that imports `src/i18n/index.ts` and wraps `Story` in `I18nextProvider` (or ensures `i18n` is initialized).

- [x] Task 2: Configure Storybook Preview
    - [x] Update `.storybook/preview.ts` to add `I18nDecorator` (or just import the i18n instance if using the global instance method).

- [x] Task 3: Verify and Polish
    - [x] Run `npm run storybook` (or check command status) to verify errors are gone.
    - [x] Check if `WaterCycle.stories.tsx` is indexed correctly.

# Task Dependencies
- Task 2 depends on Task 1.
