import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['ARCHIVE', 'node_modules', '.next', '.git'],
  },
});
