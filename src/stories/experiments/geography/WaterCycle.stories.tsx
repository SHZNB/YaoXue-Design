import type { Meta, StoryObj } from '@storybook/react-vite';
import { WaterCycle } from '../../../experiments/geography/WaterCycle';

const meta = {
  title: 'Experiments/Geography/WaterCycle',
  component: WaterCycle,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-watercycle-01',
  },
} satisfies Meta<typeof WaterCycle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
