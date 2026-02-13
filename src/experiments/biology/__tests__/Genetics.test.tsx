import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Genetics } from '../Genetics';
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

describe('Genetics Component', () => {
  const experimentId = 'test-exp-id';

  it('renders correctly', () => {
    render(<Genetics experimentId={experimentId} />);
    
    expect(screen.getByText('biology.genetics.mendel_experiment')).toBeInTheDocument();
    expect(screen.getAllByText('biology.genetics.p1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('biology.genetics.p2').length).toBeGreaterThan(0);
    expect(screen.getByText('biology.genetics.breed')).toBeInTheDocument();
  });

  it('selects parent genotypes', () => {
    render(<Genetics experimentId={experimentId} />);
    
    // Find selects by their nearby labels or order
    const selects = screen.getAllByRole('combobox');
    
    fireEvent.change(selects[0], { target: { value: 'yy' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_parent', { parent: 1, genotype: 'yy' });

    fireEvent.change(selects[1], { target: { value: 'Yy' } });
    expect(logAction).toHaveBeenCalledWith(experimentId, 'set_parent', { parent: 2, genotype: 'Yy' });
  });

  it('breeds and shows results', () => {
    render(<Genetics experimentId={experimentId} />);
    
    const breedBtn = screen.getByText('biology.genetics.breed');
    fireEvent.click(breedBtn);

    expect(logAction).toHaveBeenCalledWith(experimentId, 'breed', expect.any(Object));
    expect(screen.getByText('biology.genetics.results')).toBeInTheDocument();
    expect(screen.getByText('biology.genetics.total_offspring')).toBeInTheDocument();
  });
});
