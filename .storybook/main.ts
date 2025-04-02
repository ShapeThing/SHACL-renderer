import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../README.mdx', '../**/*.mdx', '../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    'storybook-addon-swc'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  viteFinal: async config => {
    config.plugins = config.plugins?.filter(item => item?.name !== 'vite-plugin-top-level-await')
    return config
  },

  typescript: {
    reactDocgen: false
  },

  docs: {
    autodocs: false
  }
}
export default config
