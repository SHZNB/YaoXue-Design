import type { Preview } from '@storybook/react-vite'
import { WebGLWrapper } from '../src/stories/decorators/WebGLWrapper';
import { I18nDecorator } from '../src/stories/decorators/I18nDecorator';
import '../src/index.css'; // Ensure Tailwind styles are loaded

const preview: Preview = {
  decorators: [I18nDecorator, WebGLWrapper],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;