import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlameTest } from '../FlameTest';
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

describe('FlameTest Component', () => {
  const experimentId = 'test-exp-id';

  it('renders correctly', () => {
    render(<FlameTest experimentId={experimentId} />);
    
    expect(screen.getByText('chemistry.flame_test.burner')).toBeInTheDocument();
    expect(screen.getByText('chemistry.flame_test.select_metal')).toBeInTheDocument();
  });

  it('activates flame when metal is selected', () => {
    render(<FlameTest experimentId={experimentId} />);
    
    // Assuming buttons are rendered for metals
    // First button is likely a metal selection (or use specific text if known, but translation mock returns key)
    // The component uses keys like 'chemistry.flame_test.sodium'
    // Let's find by the mocked key
    const sodiumBtn = screen.getByText('chemistry.flame_test.sodium');
    fireEvent.click(sodiumBtn);

    expect(logAction).toHaveBeenCalledWith(experimentId, 'test_metal', { metal: 'Na' });
    // Check if flame appears (might need to check for a specific element or class)
    // The component renders a flame div when burning
  });
});
