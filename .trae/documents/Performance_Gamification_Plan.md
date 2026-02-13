# Performance Optimization and Gamification Plan

## Objective
To resolve the "sluggish performance, frequent freezes, and eternal test issues" reported by the user, and to implement a "Game-like" upgrade with better visuals and interactivity.

## Execution Strategy

### Phase 1: Core Performance Optimization (The Foundation)
**Goal**: Ensure smooth 60fps rendering and fast (<10s) test execution.
1.  **Test Environment Optimization**:
    *   Switch Vitest environment to `happy-dom` for faster DOM simulation.
    *   Optimize `src/test/setup.ts` to use lighter mocks for R3F and Lucide icons.
2.  **Physics Engine Refactoring**:
    *   Refactor `FreeFall.tsx` (and subsequently others) to decouple physics calculations from React's render cycle.
    *   Use `useRef` for mutable state (position, velocity) and `useFrame` for direct DOM/WebGL manipulation.
    *   Throttle React state updates (e.g., UI text overlays) to ~10Hz to prevent main thread congestion.
3.  **Logger Optimization**:
    *   Implement throttling in `src/utils/logger.ts` to prevent log spam during high-frequency events.

### Phase 2: Gamification Upgrade (The Experience)
**Goal**: Make experiments engaging and interactive.
1.  **Visual Feedback System**:
    *   Create a shared `ParticleSystem` component for effects (confetti, sparks, bubbles).
    *   Integrate visual cues for success/failure states.
2.  **Gamified Mechanics**:
    *   **Physics**:
        *   **Pendulum**: Add a "Target Period Challenge" where students adjust length to match a specific period.
        *   **Circuit**: Add "Short Circuit" visual hazards (sparks/smoke) and safety scores.
    *   **Biology**:
        *   **Microscope**: Add a "Focus Minigame" where students must fine-tune focus to see clear cells.
    *   **Chemistry**:
        *   **Titration**: Add a "Precision Challenge" for adding drops exactly at the equivalence point.
    *   **Geography**:
        *   **Volcano**: Add an "Eruption Intensity Score" based on parameter inputs.
3.  **Scoring System**:
    *   Update `ExperimentDataPanel` to include a real-time score or achievement display.

### Phase 3: Verification & Polish
**Goal**: Confirm stability and performance.
1.  **Benchmarks**:
    *   Verify `npm run test` completes in <10 seconds.
    *   Confirm visual frame rate is stable at 60fps during simulations.
2.  **User Acceptance**:
    *   Ensure all new game mechanics are intuitive and bug-free.

## Next Steps
Once this plan is approved, I will begin with **Phase 1**, starting with the test environment optimization to ensure we have a fast feedback loop.
