import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {outDir: 'build', sourcemap: true},
  server: {
    proxy : {
      '/': {
        target : "http://localhost:3000",
        changeOrigin: true
      },
    },
  },
  resolve: {
    alias: [{find: '@', replacement: '/src'}],
  }
})
