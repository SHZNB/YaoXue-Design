import React, { useEffect, useState, Suspense } from 'react';
import { Decorator } from '@storybook/react';

const WebGLCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsSupported(!!gl);
    } catch {
      setIsSupported(false);
    }
  }, []);

  if (isSupported === null) {
    return <div className="p-4 text-slate-500">Checking WebGL support...</div>;
  }

  if (isSupported === false) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg text-red-800">
        <h3 className="font-bold text-lg mb-2">WebGL Not Supported</h3>
        <p>Your browser or device does not support WebGL, which is required for 3D experiments.</p>
      </div>
    );
  }

  return <>{children}</>;
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-orange-50 border border-orange-200 rounded-lg text-orange-800">
          <h3 className="font-bold text-lg mb-2">Rendering Error</h3>
          <p className="mb-4">Something went wrong while rendering this component.</p>
          <pre className="text-xs bg-white p-2 rounded border border-orange-100 overflow-auto max-w-full text-left">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export const WebGLWrapper: Decorator = (Story) => (
  <WebGLCheck>
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading 3D Assets...</div>}>
        <Story />
      </Suspense>
    </ErrorBoundary>
  </WebGLCheck>
);
