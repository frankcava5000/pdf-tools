import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['pdf-lib', 'pdfjs-dist'],
  },
  build: {
    rollupOptions: {
      external: ['pdf-lib'],
    },
  },
});
