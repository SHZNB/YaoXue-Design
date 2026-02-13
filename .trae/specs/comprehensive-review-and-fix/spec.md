# Comprehensive Code Review and Bug Fix Spec

## Why
The user has requested a thorough "3x check" of the entire codebase to find and fix any remaining bugs, following previous fixes for test hangs and build errors. This is a general stability and correctness pass.

## What Changes
1.  **Code Audit**:
    *   Scan for common React anti-patterns (e.g., missing dependency arrays, state mutations).
    *   Check for potential memory leaks (uncleared intervals/listeners).
    *   Verify Three.js resource disposal.
    *   Ensure all TypeScript types are strict and correct (no implicit `any`).
2.  **Fix Identified Issues**:
    *   Apply fixes for any issues found during the audit.
    *   Specifically check `ParticleSystem` and other new components for edge cases.
3.  **Verify**:
    *   Run linting and type checking again to ensure no regression.
    *   Run tests to confirm stability.

## Impact
-   **Affected Files**: Potentially any file in `src/`.
-   **Verification**: `npm run check`, `npm run lint`, and `npm run test` pass.

## ADDED Requirements
### Requirement: Code Quality
The codebase SHALL be free of critical bugs, memory leaks, and type errors as detectable by static analysis and manual review.
