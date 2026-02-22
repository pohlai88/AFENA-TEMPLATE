import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lite-meta/index': 'src/lite-meta/index.ts',
    'schemas/index': 'src/schemas/index.ts',
    'types/index': 'src/types/index.ts',
    'mappings/index': 'src/mappings/index.ts',
    'enums/index': 'src/enums/index.ts',
    'registries/index': 'src/registries/index.ts',
    'validators/index': 'src/validators/index.ts',
    'domain/index': 'src/domain/index.ts',
    'domain/finance': 'src/domain/finance.ts',
    'domain/supply-chain': 'src/domain/supply-chain.ts',
    'domain/hr': 'src/domain/hr.ts',
    'domain/manufacturing': 'src/domain/manufacturing.ts',
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
