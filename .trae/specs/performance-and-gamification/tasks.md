# Tasks

- [ ] Task 1: Fix Core Performance Issues
    - [ ] Update `vite.config.ts`: Add `environment: 'happy-dom'` for faster tests.
    - [ ] Optimize `setup.tsx`: Simplify R3F mocks to avoid deep rendering.
    - [ ] Update `src/utils/logger.ts`: Add a check to prevent log spam (e.g., max 10 logs/sec).

- [ ] Task 2: Refactor Physics Engine (FreeFall)
    - [ ] Rewrite `FreeFall.tsx` to use `useRef` for physics state (height, velocity).
    - [ ] Move visual updates to `useFrame` (direct mesh mutation).
    - [ ] Throttle React state updates (e.g., `setTime` every 100ms).
    - [ ] Add `ParticleSystem` component (simple confetti/dust using `THREE.Points`).

- [ ] Task 3: Gamify Physics (Pendulum & Circuit)
    - [ ] Update `Pendulum.tsx`: Add a "Target Period Challenge" mode (user must adjust length to match a target).
    - [ ] Update `Circuit.tsx`: Add a "Short Circuit Hazard" visual effect (sparks/smoke).
    - [ ] Add `ScoreDisplay` component to `ExperimentDataPanel`.

- [ ] Task 4: Enhance Biology/Chemistry/Geography
    - [ ] Update `Microscope.tsx`: Add a "Focus Game" (blur/sharpness mechanic).
    - [ ] Update `Titration.tsx`: Add "Perfect Drop" challenge (score based on precision).
    - [ ] Update `Volcano.tsx`: Add "Eruption Score" (based on height/damage).

- [ ] Task 5: Verify & Benchmark
    - [ ] Run `npm run test` and ensure <10s execution.
    - [ ] Verify 60fps in browser (visual check via stats).

# Task Dependencies
- Task 2 depends on Task 1.
- Task 3/4 depend on Task 1.
