import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react(),tailwindcss(),nodePolyfills()
  ],
})
