import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      styles: resolve(__dirname, 'src/styles'),
      components: resolve(__dirname, 'src/components'),
      modules: resolve(__dirname, 'src/modules'),
      scripts: resolve(__dirname, 'src/scripts'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')({
          overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
        }),
      ],
    },
  },
});
