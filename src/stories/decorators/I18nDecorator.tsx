import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { StoryFn } from '@storybook/react';

export const I18nDecorator = (Story: StoryFn) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
);
