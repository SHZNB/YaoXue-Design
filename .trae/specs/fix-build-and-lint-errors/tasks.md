# Tasks

- [ ] Task 1: Fix LogPayload Types
    - [ ] Update `src/experiments/chemistry/Electrolysis.tsx`: Add index signature or cast payload.
    - [ ] Update `src/experiments/chemistry/FlameTest.tsx`: Add index signature or cast payload.
    - [ ] Update `src/experiments/chemistry/Titration.tsx`: Add index signature or cast payload.

- [ ] Task 2: Fix Setup Script
    - [ ] Rename `src/test/setup.tsx` to `src/test/setup.ts`.
    - [ ] Replace all JSX (e.g., `<div>...</div>`) with `React.createElement`.
    - [ ] Update `vite.config.ts` to point to `src/test/setup.ts`.

- [ ] Task 3: Verify
    - [ ] Run `npm run check` (TypeScript).
    - [ ] Run `npm run lint`.

# Task Dependencies
- Task 3 depends on Task 1 and 2.
