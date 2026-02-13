import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Electrolysis } from '../Electrolysis';
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

describe('Electrolysis Component', () => {
  const experimentId = 'test-exp-id';

  it('renders correctly', () => {
    render(<Electrolysis experimentId={experimentId} />);
    
    expect(screen.getByText('chemistry.electrolysis.power_source')).toBeInTheDocument();
    expect(screen.getByText('chemistry.electrolysis.anode')).toBeInTheDocument();
    expect(screen.getByText('chemistry.electrolysis.cathode')).toBeInTheDocument();
  });

  it('updates voltage and bubbles on input change', () => {
    render(<Electrolysis experimentId={experimentId} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '10' } });

    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_voltage', { voltage: 10 });
    expect(screen.getByText('10V')).toBeInTheDocument();
  });
});
