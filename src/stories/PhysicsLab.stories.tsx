import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhysicsLab } from '../experiments/PhysicsLab';

const meta = {
  title: 'Experiments/PhysicsLab',
  component: PhysicsLab,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'demo-physics-01',
  },
} satisfies Meta<typeof PhysicsLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InteractiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interact with draggable objects in a 3D environment.',
      },
    },
  },
};
