import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlateTectonics } from '../../../experiments/geography/PlateTectonics';

const meta = {
  title: 'Experiments/Geography/PlateTectonics',
  component: PlateTectonics,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-platetectonics-01',
  },
} satisfies Meta<typeof PlateTectonics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
