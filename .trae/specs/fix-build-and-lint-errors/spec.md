# Fix Build and Lint Errors Spec

## Why
The user reported linter errors preventing progress. Specifically, TypeScript mismatches for `LogPayload` in chemistry experiments and syntax errors in `src/test/setup.ts` (likely due to JSX in a file treated as TS). We need to "debug first" before moving to performance tasks.

## What Changes
1.  **Fix TypeScript Errors**: Update `ElectrolysisData`, `FlameTestData`, and `TitrationData` interfaces to be compatible with `LogPayload`.
2.  **Fix Setup Script**: Convert `src/test/setup.tsx` to `src/test/setup.ts` and replace JSX with `React.createElement` to ensure compatibility and avoid "Unterminated regex" errors.

## Impact
-   **Affected Files**: `src/experiments/chemistry/*.tsx`, `src/test/setup.tsx`.
-   **Verification**: `npm run lint` and `npm run check` should pass.

## ADDED Requirements
### Requirement: Clean Build
The project SHALL build and lint without errors.
