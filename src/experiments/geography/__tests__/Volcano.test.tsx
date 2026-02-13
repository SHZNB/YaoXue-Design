import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Volcano } from '../Volcano';
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

describe('Volcano Component', () => {
  const experimentId = 'test-exp-id';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    render(<Volcano experimentId={experimentId} />);
    
    expect(screen.getByText('geography.volcano.parameters')).toBeInTheDocument();
    expect(screen.getByText(/geography.volcano.viscosity/)).toBeInTheDocument();
    expect(screen.getByText(/geography.volcano.gas_content/)).toBeInTheDocument();
    expect(screen.getByText('geography.volcano.simulate_eruption')).toBeInTheDocument();
  });

  it('adjusts parameters', () => {
    render(<Volcano experimentId={experimentId} />);
    
    const sliders = screen.getAllByRole('slider');
    
    // Viscosity
    fireEvent.change(sliders[0], { target: { value: '80' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_viscosity', { viscosity: 80 });

    // Gas Content
    fireEvent.change(sliders[1], { target: { value: '70' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_gas', { gas: 70 });
  });

  it('simulates eruption', () => {
    render(<Volcano experimentId={experimentId} />);
    
    const eruptBtn = screen.getByText('geography.volcano.simulate_eruption');
    fireEvent.click(eruptBtn);

    expect(logAction).toHaveBeenCalledWith(experimentId, 'erupt', expect.any(Object));
    expect(screen.getByText('geography.volcano.erupting')).toBeInTheDocument();

    // Fast forward to end eruption
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('geography.volcano.simulate_eruption')).toBeInTheDocument();
  });
});
