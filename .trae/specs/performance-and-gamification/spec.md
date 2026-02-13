# Performance Optimization & Gamification Spec

## Why
The user reports "sluggish performance, frequent freezes, and eternal test issues". Code analysis reveals that physics simulations (e.g., `FreeFall.tsx`) trigger React re-renders on every animation frame (60fps), choking the main thread. Additionally, the user requested a "Game-like" upgrade with better visuals and interactivity.

## What Changes

### 1. Performance Optimization (Core)
-   **Refactor Animation Loops**: Move physics calculations out of React state (`useState`) and into `useRef` + `useFrame` (direct mutation).
-   **Throttled UI Updates**: Limit React state updates for UI overlays (e.g., timer/height text) to 10fps instead of 60fps.
-   **Optimized Testing**:
    -   Fix circular/heavy mocks in `setup.tsx`.
    -   Ensure tests wait for async states properly to eliminate "not wrapped in act" warnings.
    -   Switch to `happy-dom` for faster unit test execution.

### 2. Gamification Upgrade
-   **Visuals**: Add particle effects (confetti/dust) upon event completion (e.g., ball hitting ground).
-   **Interactivity**: Add "Challenge Mode" where students must predict results to earn points.
-   **Feedback**: Real-time score display and "Success/Failure" animations.

## Impact
-   **Affected Files**: `src/experiments/physics/*.tsx`, `src/components/lab/ExperimentDataPanel.tsx`, `vite.config.ts`, `src/test/setup.tsx`.
-   **Performance**: Frame rate should stabilize at 60fps; Tests should run <10s.

## ADDED Requirements
### Requirement: High-Performance Rendering
Simulations SHALL NOT trigger React component re-renders more than 10 times per second during active animation. Visual updates must be handled via direct DOM/WebGL manipulation.

### Requirement: Gamified Feedback
Experiments SHALL provide visual feedback (particles, sound, or score popup) when a user successfully records valid data or completes a task.

### Requirement: Robust Testing
The test suite SHALL pass 100% with no timeouts on a standard dev machine.
