# Tasks

- [ ] Task 1: Diagnose and Fix Test Hangs
    - [ ] Create/Update `src/test/setup.ts`: Add comprehensive mocks for Supabase (auth, from, select, insert, update, delete).
    - [ ] Update `src/test/setup.ts`: Add `vi.clearAllTimers()` and `vi.clearAllMocks()` in `afterEach`.
    - [ ] Update `src/test/setup.ts`: Ensure R3F mocks don't create real canvas elements or WebGL contexts.
    - [ ] Verify `vite.config.ts`: Ensure `setupFiles` points to `src/test/setup.ts`.

- [ ] Task 2: Verify Test Speed
    - [ ] Run `npm run test` and confirm execution time is <20s.

# Task Dependencies
- Task 2 depends on Task 1.
