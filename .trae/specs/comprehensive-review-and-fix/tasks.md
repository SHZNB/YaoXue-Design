# Tasks

- [ ] Task 1: Static Analysis & Type Check
    - [ ] Run `npm run check` to identify any lingering type errors.
    - [ ] Run `npm run lint` to catch code style and potential logic issues.
    - [ ] Fix any issues reported by these tools.

- [ ] Task 2: React & Three.js Logic Review
    - [ ] Review `src/experiments/**/*.tsx` for `useEffect` dependency issues.
    - [ ] Review Three.js components (e.g., `ParticleSystem`, `FreeFall`) for proper cleanup (geometry/material disposal if manual).
    - [ ] Check `src/utils/logger.ts` for potential race conditions or unhandled errors.

- [ ] Task 3: Fix Specific Known/Found Issues
    - [ ] (If found) Fix any "missing dependency" warnings in `useEffect`.
    - [ ] (If found) Fix any potential memory leaks in event listeners.

- [ ] Task 4: Final Verification
    - [ ] Run `npm run test` one last time to ensure everything is green and fast.

# Task Dependencies
- Task 3 depends on findings from Task 1 and 2.
- Task 4 depends on Task 3.
