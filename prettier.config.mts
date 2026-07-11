import type { Config } from 'prettier'
import type { PluginOptions } from 'prettier-plugin-tailwindcss'

const config: Config & PluginOptions = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',

  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind CSS v4 entry point.
  tailwindStylesheet: './src/app/globals.css',
}

export default config
