import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./plugins/**/*', './src/**/*'],
  outDir: './dist',
  bundle: false,
  clean: true,
  dts: false,
  minify: true,
  splitting: false,
  sourcemap: false,
  skipNodeModulesBundle: true,
});
