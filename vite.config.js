import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Define path aliases for cleaner imports
      '@': resolve(__dirname, 'src'),
      styles: resolve(__dirname, 'src/styles'),
      components: resolve(__dirname, 'src/components'),
      scripts: resolve(__dirname, 'src/scripts'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    open: true, // Automatically opens the default browser when the server starts
    port: 3000, // Specify the port number for the development server (default is 3000)
  },
});
