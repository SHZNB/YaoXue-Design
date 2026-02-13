import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlameTest } from '../../../experiments/chemistry/FlameTest';

const meta = {
  title: 'Experiments/Chemistry/FlameTest',
  component: FlameTest,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-flametest-01',
  },
} satisfies Meta<typeof FlameTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
