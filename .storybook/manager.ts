import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: '@Shapething - SHACL Renderer',
  brandUrl: 'https://shapething.com',
  brandTarget: '_self'
})

addons.setConfig({
  theme
})
