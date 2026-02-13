# Storybook Fix and Stabilization Spec

## Why
The user reported that Storybook fails to index stories, specifically citing `WaterCycle.stories.tsx` and stating "stories are full of errors". The root cause is primarily the lack of an `I18nextProvider` in the Storybook environment, which causes components using `useTranslation` to fail. Additionally, we need to ensure the environment variables for Supabase don't cause crashes, although the code seems resilient.

## What Changes
- **Storybook Configuration**:
    - Create a new decorator `I18nDecorator` to wrap stories with the i18n provider.
    - Update `.storybook/preview.ts` to apply this decorator globally.
- **Verification**:
    - Ensure all experiment stories render without "NO_I18NEXT_INSTANCE" errors.

## Impact
- **Affected Specs**: N/A (Fixes existing functionality).
- **Affected Code**: `.storybook/preview.ts`, `src/stories/decorators/I18nDecorator.tsx`.

## ADDED Requirements
### Requirement: I18n Support in Storybook
The Storybook environment SHALL provide a valid `i18n` instance to all components, preventing runtime errors.

### Requirement: Story Indexing
All stories in `src/stories/experiments/` SHALL be indexable and renderable by Storybook.
