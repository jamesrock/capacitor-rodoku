import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: './src/index.html',
        about: './src/about.html',
        privacy: './src/privacy.html',
      },
      plugins: [terser()]
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
});
