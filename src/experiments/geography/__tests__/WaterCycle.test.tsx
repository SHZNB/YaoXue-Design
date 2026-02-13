import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WaterCycle } from '../WaterCycle';
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

describe('WaterCycle Component', () => {
  const experimentId = 'test-exp-id';

  it('renders correctly', () => {
    render(<WaterCycle experimentId={experimentId} />);
    
    expect(screen.getByText('geography.water_cycle.climate_control')).toBeInTheDocument();
    expect(screen.getByText(/geography.water_cycle.temperature/)).toBeInTheDocument();
    expect(screen.getByText(/geography.water_cycle.humidity/)).toBeInTheDocument();
  });

  it('logs initialization', () => {
    render(<WaterCycle experimentId={experimentId} />);
    expect(logAction).toHaveBeenCalledWith(experimentId, 'init', expect.any(Object));
  });

  it('adjusts climate parameters', () => {
    render(<WaterCycle experimentId={experimentId} />);
    
    const sliders = screen.getAllByRole('slider');
    
    // Temperature
    fireEvent.change(sliders[0], { target: { value: '35' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_temperature', { temperature: 35 });

    // Humidity
    fireEvent.change(sliders[1], { target: { value: '80' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_humidity', { humidity: 80 });
  });
});
