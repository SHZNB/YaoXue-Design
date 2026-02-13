import type { Meta, StoryObj } from '@storybook/react-vite';
import { Electrolysis } from '../../../experiments/chemistry/Electrolysis';

const meta = {
  title: 'Experiments/Chemistry/Electrolysis',
  component: Electrolysis,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-electrolysis-01',
  },
} satisfies Meta<typeof Electrolysis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
