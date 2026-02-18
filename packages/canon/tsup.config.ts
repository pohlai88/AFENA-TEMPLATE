import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lite-meta/index': 'src/lite-meta/index.ts',
    'schemas/index': 'src/schemas/index.ts',
    'types/index': 'src/types/index.ts',
    'mappings/index': 'src/mappings/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json',

  // Enable tree-shaking optimizations
  treeshake: true,
  splitting: true,
});
