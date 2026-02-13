import type { Meta, StoryObj } from '@storybook/react-vite';
import { Titration } from '../../../experiments/chemistry/Titration';

const meta = {
  title: 'Experiments/Chemistry/Titration',
  component: Titration,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-titration-01',
  },
} satisfies Meta<typeof Titration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
