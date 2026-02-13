import type { Meta, StoryObj } from '@storybook/react-vite';
import { Microscope } from '../../../experiments/biology/Microscope';

const meta = {
  title: 'Experiments/Biology/Microscope',
  component: Microscope,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-microscope-01',
  },
} satisfies Meta<typeof Microscope>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
