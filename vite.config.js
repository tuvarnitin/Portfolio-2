import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          animation: ['gsap', 'lenis'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          charts: ['recharts'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    target: 'esnext',
  },
  server: {
    port: 5173,
    open: true,
  },
});
