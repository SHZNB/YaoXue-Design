import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlateTectonics } from '../PlateTectonics';
import { logAction } from '../../../utils/logger';

// Mocks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../../utils/logger', () => ({
  logAction: vi.fn(),
}));

describe('PlateTectonics Component', () => {
  const experimentId = 'test-exp-id';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    render(<PlateTectonics experimentId={experimentId} />);
    
    expect(screen.getByText('geography.plate_tectonics.simulator')).toBeInTheDocument();
    expect(screen.getByText('geography.plate_tectonics.force_type')).toBeInTheDocument();
    expect(screen.getByText('geography.pressure')).toBeInTheDocument();
    expect(screen.getByText('geography.tension')).toBeInTheDocument();
  });

  it('logs initialization', () => {
    render(<PlateTectonics experimentId={experimentId} />);
    expect(logAction).toHaveBeenCalledWith(experimentId, 'init', expect.any(Object));
  });

  it('simulates pressure force', () => {
    render(<PlateTectonics experimentId={experimentId} />);
    
    const pressureBtn = screen.getByText(/geography.pressure/);
    fireEvent.click(pressureBtn);
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_force', { type: 'pressure' });

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '90' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_magnitude', { magnitude: 90 });

    // Advance time to allow deformation
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Check if structure type changed (requires enough deformation)
    // We can't easily check internal state, but we can check if logAction was called for structure formation
    // or if the text "Fold" appears (if we mocked translation to return 'Fold')
    // In our mock t(key) returns key.
    // 'geography.fold' should appear.
    
    // Note: simulation interval is 100ms, change is magnitude * 0.05. 
    // 90 * 0.05 = 4.5 per tick. 
    // To reach > 80, we need ~18 ticks = 1800ms.
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(logAction).toHaveBeenCalledWith(experimentId, 'structure_formed', { type: 'fold' });
  });
});
