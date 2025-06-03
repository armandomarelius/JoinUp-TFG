import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    allowedHosts: [
      'localhost',
      '192.168.1.155',
      '127.0.0.1',
      '0.0.0.0',
      'joinup-project-joinupcompose-ncv5ku-dacd89-192-168-1-155.traefik.me',
      /.*\.traefik\.me$/
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all'
  }
})
