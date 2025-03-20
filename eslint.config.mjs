import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import n8nNodesBasePlugin from 'eslint-plugin-n8n-nodes-base';
import globals from 'globals';
import jsoncPlugin from 'eslint-plugin-jsonc';

export default [
  // Global configuration for TypeScript files
  {
    files: ['**/*.ts'],
    ignores: [
      '.eslintrc.js',
      '**/node_modules/**',
      '**/dist/**',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs['recommended'].rules,
      ...typescriptEslintPlugin.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Global configuration for JavaScript files
  {
    files: ['**/*.js'],
    ignores: [
      '.eslintrc.js',
      '**/node_modules/**',
      '**/dist/**',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      sourceType: 'commonjs',
      parser: typescriptEslintParser,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Configuration for credentials/**/*.ts
  {
    files: ['./credentials/**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      'n8n-nodes-base': n8nNodesBasePlugin,
    },
    rules: {
      ...n8nNodesBasePlugin.configs.credentials.rules,
      'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
      'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
    },
  },
  // Configuration for credentials/**/*.js
  {
    files: ['./credentials/**/*.js'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    plugins: {
      'n8n-nodes-base': n8nNodesBasePlugin,
    },
    rules: {
      ...n8nNodesBasePlugin.configs.credentials.rules,
      'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
      'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Configuration for nodes/**/*.ts
  {
    files: ['./nodes/**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      'n8n-nodes-base': n8nNodesBasePlugin,
    },
    rules: {
      ...n8nNodesBasePlugin.configs.nodes.rules,
      'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
      'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
      'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
    },
  },
  // Configuration for nodes/**/*.js
  {
    files: ['./nodes/**/*.js'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    plugins: {
      'n8n-nodes-base': n8nNodesBasePlugin,
    },
    rules: {
      ...n8nNodesBasePlugin.configs.nodes.rules,
      'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
      'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
      'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  // Configuration for *.mjs files
  {
    files: ['*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];