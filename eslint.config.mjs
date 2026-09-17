import stylistic from '@stylistic/eslint-plugin'
import importX from 'eslint-plugin-import-x'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

import withNuxt from './.nuxt/eslint.config.mjs'

const severityLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'error'

export default withNuxt(
  stylistic.configs.recommended,
  prettierRecommended,

  {
    name: 'project/custom-rules',

    plugins: {
      '@stylistic': stylistic,
      'import-x': importX,
    },

    rules: {
      'vue/no-v-html': 'off',
      'default-param-last': severityLevel,

      'no-console': [
        severityLevel,
        {
          allow: ['warn', 'error', 'info', 'group', 'groupEnd', 'groupCollapsed'],
        },
      ],

      'class-methods-use-this': 'off',
      'no-param-reassign': severityLevel,
      'no-shadow': 'off',

      'vue/no-v-for-template-key': 'off',
      'vue/no-multiple-template-root': 'off',

      'prettier/prettier': [
        severityLevel,
        {
          semi: false,
          endOfLine: 'auto',
        },
      ],

      'import-x/order': [
        severityLevel,
        {
          'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'index', 'sibling', 'object'],

          'pathGroups': [
            {
              pattern: 'composables',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'composables/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'layouts',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'layouts/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'pages',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'pages/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'widgets',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'widgets/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'features',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'features/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'entities',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'entities/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/molecules',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/molecules/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/atoms',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/atoms/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/skeletons',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/ui/skeletons/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/api',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/api/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/constants',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/constants/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/helpers',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/helpers/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/models',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/models/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/testing',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/testing/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/toolkit',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/toolkit/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'shared/types',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '**/shared/types/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'public',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'public/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'assets',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'assets/**',
              group: 'internal',
              position: 'after',
            },
          ],

          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },

          'newlines-between': 'never',

          'pathGroupsExcludedImportTypes': ['internal'],
        },
      ],

      'no-restricted-syntax': [
        severityLevel,
        {
          selector: 'CallExpression[arguments.length=1] > MemberExpression.callee > Identifier.property[name=at]',
          message: 'Do not use the native array method "at", it is not supported by older browsers',
        },
        {
          selector: 'CallExpression[arguments.length=1] > MemberExpression.callee > Identifier.property[name=findLast]',
          message: 'Do not use the native array method "findLast", it is not supported by older browsers',
        },
      ],

      'no-restricted-imports': [
        severityLevel,
        {
          paths: [
            {
              name: 'nuxt/app',
              message: "Use '#app' path import instead of 'nuxt/app'",
            },
          ],
        },
      ],

      'vue/multi-word-component-names': 'off',
      'vue/max-len': 'off',

      '@stylistic/max-len': [
        severityLevel,
        {
          code: 120,
        },
      ],
    },
  },

  {
    name: 'project/tests',

    files: ['**/*.spec.js', '**/*.spec.ts'],

    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  {
    name: 'project/ignores',

    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/public/**',
      '**/.eslintrc.*',
      '**/eslint.config.*',
    ],
  },
).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      severityLevel,
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],

    '@typescript-eslint/naming-convention': [
      severityLevel,

      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],

        filter: {
          regex: '^(Window|RouteMeta|Navigator|NuxtApp|ComponentCustomProperties|RuntimeConfig|PublicRuntimeConfig)$',
          match: false,
        },
      },

      {
        selector: 'enum',
        format: ['PascalCase'],
        prefix: ['E'],
      },

      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],

    '@typescript-eslint/no-shadow': [severityLevel],

    '@typescript-eslint/no-useless-empty-export': severityLevel,

    '@typescript-eslint/no-explicit-any': severityLevel,

    '@typescript-eslint/max-params': [
      severityLevel,
      {
        max: 3,
      },
    ],

    '@typescript-eslint/no-unsafe-function-type': severityLevel,

    '@typescript-eslint/prefer-nullish-coalescing': 'off',

    '@typescript-eslint/default-param-last': severityLevel,

    '@typescript-eslint/no-non-null-assertion': severityLevel,

    '@typescript-eslint/no-unused-vars': [
      severityLevel,
      {
        varsIgnorePattern: '_',
        argsIgnorePattern: '_',
      },
    ],

    '@typescript-eslint/no-dynamic-delete': 'off',
  },
})
