import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      plugins: [terser()]
    },
  },
});
