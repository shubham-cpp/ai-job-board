import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { globalIgnores } from 'eslint/config'

const eslintConfig = antfu(
  {
    gitignore: true,
    react: true,
    nextjs: true,
    typescript: true,
    stylistic: true,
    unicorn: true,
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    './src/lib/server/db/migrations/**',
    'public/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      // Start with recommended warnings (less disruptive)
      ...betterTailwindcss.configs['recommended-error'].rules,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
      },
    },
  },
)

export default eslintConfig
