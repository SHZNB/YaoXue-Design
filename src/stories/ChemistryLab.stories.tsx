import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChemistryLab } from '../experiments/ChemistryLab';

const meta = {
  title: 'Experiments/ChemistryLab',
  component: ChemistryLab,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'demo-chem-01',
  },
} satisfies Meta<typeof ChemistryLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPreloadedData: Story = {
  args: {
    experimentId: 'demo-chem-02',
  },
  parameters: {
    mockData: {
      logs: [
        { action: 'add_chemical', payload: { type: 'water' } }
      ]
    }
  }
};
