module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // React rules
    'react/prop-types': 'off', // Since we're using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 'warn',

    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-relative-parent-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-default-export': 'off',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-unused-vars': 'off', // Using TypeScript's no-unused-vars instead
  },
};
