import { afterEach, vi } from 'vitest';
import React from 'react';

// Mock Supabase first, before imports that might use it
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
  hasSupabaseEnv: true,
}));

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.clearAllMocks();
});

// Global Mocks for R3F to avoid WebGL errors in all tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  useFrame: vi.fn(), // No-op to prevent crashes in tests
  useThree: vi.fn(() => ({ 
    camera: { position: [0, 0, 0] }, 
    gl: { domElement: document.createElement('canvas') },
    scene: {},
    raycaster: {},
    size: { width: 800, height: 600 },
    viewport: { width: 800, height: 600, factor: 1, distance: 1, aspect: 1.33 }
  })),
  useLoader: vi.fn(),
  extend: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(),
  useTexture: vi.fn(),
  OrbitControls: () => null,
  Stars: () => null,
  Sky: () => null,
  Text: () => null,
  Html: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  Sphere: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  Box: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  Cylinder: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  Line: () => null,
}));

// Global Mock for Lucide React
// Using a Proxy to mock any icon component requested
vi.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '__esModule') return true;
      // Return a simple component for any icon import
      return (props: Record<string, unknown>) => React.createElement('span', { 'data-testid': `icon-${String(prop).toLowerCase()}`, ...props });
    },
  });
});
