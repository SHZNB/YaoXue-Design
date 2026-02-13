import type { Meta, StoryObj } from '@storybook/react-vite';
import { GeographyLab } from '../experiments/GeographyLab';

const meta = {
  title: 'Experiments/GeographyLab',
  component: GeographyLab,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'demo-geo-01',
  },
} satisfies Meta<typeof GeographyLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GeologicalSimulation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Simulate geological structures (folds and faults) by applying pressure or tension.',
      },
    },
  },
};
