# Storybook WebGL Context & DevOps Enhancement Plan

## Objective
To ensure robust 3D rendering in Storybook by managing WebGL context effectively, and to provide a seamless "one-click" developer experience and comprehensive deployment guide.

## Scope
1.  **Storybook Configuration**: Enhance `.storybook/preview.ts` to support WebGL context checks and error handling for 3D components.
2.  **Startup Script**: Refine `start-lab.sh` to be a robust, one-click solution for local development.
3.  **Deployment Documentation**: Expand `DEPLOY.md` with performance best practices and deep troubleshooting.

## Detailed Tasks

### 1. Storybook WebGL Integration
*   **Context Decorator**: Create a global decorator that checks for WebGL availability before rendering stories. This prevents "blank screen" errors on unsupported devices.
*   **Error Boundary**: Integrate a React Error Boundary specifically for Canvas components to catch R3F errors gracefully in Storybook.
*   **Configuration**: Update `.storybook/preview.ts` to apply these decorators globally.

### 2. `start-lab.sh` Enhancements
*   **Prerequisites Check**: Add checks for Node.js version (>=18) and npm.
*   **Smart Install**: Only run `npm install` if `node_modules` is missing or `package.json` has changed (optional, or just keep simple install for safety).
*   **Dev Mode**: Switch default action to `npm run dev` for a true hot-reloading development experience, as requested.
*   **Error Traps**: Ensure the script exits immediately on critical failures (set -e).

### 3. `DEPLOY.md` Expansion
*   **Performance Section**: Add tips on GLTF compression (Draco/Meshopt), texture resizing, and lazy loading.
*   **Troubleshooting**: Add specific entries for "WebGL Context Lost", "Supabase Connection Refused", and "CORS errors".
*   **Environment**: Detail the exact Node/npm versions and browser requirements (WebGL 2.0).

## Execution Strategy
1.  Create `src/stories/decorators/WebGLWrapper.tsx`.
2.  Modify `.storybook/preview.ts`.
3.  Rewrite `start-lab.sh` with enhanced logic.
4.  Rewrite `DEPLOY.md` with comprehensive details.
5.  Verify by running the script and checking Storybook.
