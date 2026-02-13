import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Microscope } from '../Microscope';
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

describe('Microscope Component', () => {
  const experimentId = 'test-exp-id';

  it('renders correctly', () => {
    render(<Microscope experimentId={experimentId} />);
    
    expect(screen.getByText('biology.microscope.place_slide')).toBeInTheDocument();
    expect(screen.getByText('biology.microscope.onion_epidermis')).toBeInTheDocument();
    expect(screen.getByText('biology.microscope.cheek_epithelium')).toBeInTheDocument();
    expect(screen.getByText('1x')).toBeInTheDocument();
  });

  it('selects a slide', () => {
    render(<Microscope experimentId={experimentId} />);
    
    const onionBtn = screen.getByText('biology.microscope.onion_epidermis');
    fireEvent.click(onionBtn);

    expect(logAction).toHaveBeenCalledWith(experimentId, 'select_slide', { slide: 'onion' });
    expect(screen.queryByText('biology.microscope.place_slide')).not.toBeInTheDocument();
  });

  it('adjusts zoom level', () => {
    render(<Microscope experimentId={experimentId} />);
    
    const zoomInBtn = screen.getByTestId('icon-zoom-in').parentElement!;
    fireEvent.click(zoomInBtn);

    expect(screen.getByText('2x')).toBeInTheDocument();
    expect(logAction).toHaveBeenCalledWith(experimentId, 'zoom', { level: 2 });

    const zoomOutBtn = screen.getByTestId('icon-zoom-out').parentElement!;
    fireEvent.click(zoomOutBtn);
    
    expect(screen.getByText('1x')).toBeInTheDocument();
  });
});
