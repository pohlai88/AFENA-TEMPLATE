const reactConfig = require('afena-eslint-config/react');

module.exports = [
  { ignores: ['dist/**', '*.config.*', 'engine/**'] },
  ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['src/components/typography.tsx'],
    rules: {
      'jsx-a11y/heading-has-content': 'off',
    },
  },
  {
    files: ['src/hooks/use-local-storage.ts'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['src/lib/dom.ts'],
    rules: {
      '@typescript-eslint/prefer-optional-chain': 'off',
    },
  },
  {
    files: ['src/components/file-upload.tsx'],
    rules: {
      'jsx-a11y/no-static-element-interactions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['src/components/input-group.tsx'],
    rules: {
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
    },
  },
];
