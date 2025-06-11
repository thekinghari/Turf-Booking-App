import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
