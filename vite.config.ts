/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  base: './',
  plugins: [react({
    babel: {
      plugins: ['react-dev-locator']
    }
  }), traeBadgePlugin({
    variant: 'dark',
    position: 'bottom-right',
    prodOnly: true,
    clickable: true,
    clickUrl: 'https://www.trae.ai/solo?showJoin=1',
    autoTheme: true,
    autoThemeTarget: '#root'
  }), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('proxy error', err);
          });
          // Reduce noisy logs in dev: only log errors above
        }
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [],
    projects: [{
      test: {
        name: 'unit',
        environment: 'happy-dom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['src/stories/**/*'],
        globals: true,
        setupFiles: ['src/test/setup.ts'],
      }
    }]
  }
});