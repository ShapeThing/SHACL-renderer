import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../README.mdx', '../**/*.mdx', '../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    // '@storybook/addon-links',
    '@storybook/addon-essentials'
    // '@chromatic-com/storybook',
    // '@storybook/addon-interactions',
    // 'storybook-addon-swc'
  ],

  typescript: {
    reactDocgen: false
  },

  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}
export default config
