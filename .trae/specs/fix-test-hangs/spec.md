# Fix Test Hangs and Timeouts Spec

## Why
The user reports that tests are hanging for over 10 minutes (typical duration should be <15s for this project size). The primary suspects are:
1.  **Unmocked Supabase Calls**: Real network requests to Supabase timing out.
2.  **Unmocked WebGL/Canvas**: Three.js trying to initialize WebGL in a headless environment.
3.  **Lingering Timers**: `setInterval` or `requestAnimationFrame` not being cleared.

## What Changes
1.  **Update `src/test/setup.ts`**:
    -   Add comprehensive mocks for `supabase` client (auth, db operations) to prevent network calls.
    -   Add `vi.clearAllTimers()` and `vi.clearAllMocks()` in `afterEach`.
    -   Ensure R3F/Three.js mocks are robust and don't trigger real WebGL context creation.
2.  **Verify Configuration**:
    -   Ensure `vite.config.ts` points to the correct setup file and uses `happy-dom`.

## Impact
-   **Affected Files**: `src/test/setup.ts`, `src/lib/supabase.ts` (indirectly mocked).
-   **Verification**: `npm run test` should complete in <15 seconds.

## ADDED Requirements
### Requirement: Mocked External Services
All external services (Supabase, WebGL) SHALL be mocked in the test environment to prevent network access and GPU dependency.

### Requirement: Test Performance
The full test suite SHALL complete execution in under 20 seconds on a standard developer machine.
