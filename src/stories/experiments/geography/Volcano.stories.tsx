import type { Meta, StoryObj } from '@storybook/react-vite';
import { Volcano } from '../../../experiments/geography/Volcano';

const meta = {
  title: 'Experiments/Geography/Volcano',
  component: Volcano,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    experimentId: 'story-volcano-01',
  },
} satisfies Meta<typeof Volcano>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
