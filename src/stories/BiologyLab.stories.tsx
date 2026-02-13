import type { Meta, StoryObj } from '@storybook/react-vite';
import { BiologyLab } from '../experiments/BiologyLab';

const meta = {
  title: 'Experiments/BiologyLab',
  component: BiologyLab,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'demo-bio-01',
  },
} satisfies Meta<typeof BiologyLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GrowthSimulation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Simulate plant growth by adjusting water, sunlight, and fertilizer levels.',
      },
    },
  },
};
