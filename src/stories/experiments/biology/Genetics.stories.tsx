import type { Meta, StoryObj } from '@storybook/react-vite';
import { Genetics } from '../../../experiments/biology/Genetics';

const meta = {
  title: 'Experiments/Biology/Genetics',
  component: Genetics,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-genetics-01',
  },
} satisfies Meta<typeof Genetics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
