# Lab Experiment Platform Deployment Guide

## 1. Preparation

### Environment Requirements
*   **Node.js**: v18.0.0 or higher (Required for Vite/R3F)
*   **npm**: v9.0.0 or higher
*   **Supabase Project**: A running Supabase instance (cloud or local) with PostgreSQL 15+.
*   **Browser**: Modern browser with **WebGL 2.0** support (Chrome 90+, Firefox 100+, Safari 100+).

### Repository Setup
1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and configure:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
    VITE_PRODUCTION_URL=https://your-production-domain.com
    ```

## 2. Deployment Process

### Local Development (One-Click)
Use the included script to check requirements, install dependencies, and start the dev server:
```bash
./start-lab.sh
```
*   **Windows (PowerShell)**: You can run `npm run dev` manually if bash is unavailable.

### Production Build
1.  **Build the application**:
    ```bash
    npm run build
    ```
    Artifacts will be generated in the `dist/` directory.

2.  **Deploy to Vercel/Netlify**:
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Environment Variables**: Ensure all variables from `.env` are added to the hosting platform's settings.

## 3. Database Migration
Ensure your Supabase database schema is up-to-date. Run the SQL scripts in `supabase/migrations/` in order:
1.  `20260212000000_initial_schema.sql` (Core tables)
2.  `20260212000010_create_roles_user_roles_audit.sql` (RBAC)
3.  `20260212000011_add_more_experiments.sql` (Seed data)
4.  `20260213000000_extend_experiment_metadata.sql` (Metadata update)

## 4. Troubleshooting & FAQ

### WebGL Context Lost
*   **Symptom**: 3D canvas turns black or shows an error.
*   **Cause**: Browser tab inactive for too long, or GPU driver crash.
*   **Solution**: Reload the page. The application attempts to restore context automatically via React Three Fiber.

### "Table not found" Errors
*   **Symptom**: Logs show `PGRST205` or similar errors.
*   **Cause**: Database migrations haven't been applied or the `.env` points to the wrong project.
*   **Solution**: Re-run the SQL migration scripts in the Supabase SQL Editor.

### Supabase Connection Refused
*   **Symptom**: Network errors in console.
*   **Cause**: Incorrect `VITE_SUPABASE_URL` or network restrictions (CORS).
*   **Solution**: Verify `.env` values. Check Supabase Dashboard > Authentication > URL Configuration to ensure your domain is allowed.

## 5. Performance Optimization

*   **Asset Compression**: Use `.glb` format with Draco compression for 3D models.
*   **Lazy Loading**: The application uses `React.lazy` and `Suspense` to load 3D labs only when needed.
*   **Texture Resizing**: Keep textures under 2048x2048px (preferably 1024px) for mobile compatibility.
*   **Storybook**: Use the `WebGLWrapper` decorator to prevent crashes during component testing.
