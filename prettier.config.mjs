/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: ['tsconfig.json', 'tsconfig.*.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],
};

export default config;
