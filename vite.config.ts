import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' is required for Capacitor (file://) and portable static hosting.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5173,
  },
});
