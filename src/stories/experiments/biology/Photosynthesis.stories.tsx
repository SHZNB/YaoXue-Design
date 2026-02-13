import type { Meta, StoryObj } from '@storybook/react-vite';
import { Photosynthesis } from '../../../experiments/biology/Photosynthesis';

const meta = {
  title: 'Experiments/Biology/Photosynthesis',
  component: Photosynthesis,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-photosynthesis-01',
  },
} satisfies Meta<typeof Photosynthesis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
