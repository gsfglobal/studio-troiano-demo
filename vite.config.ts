import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build in due passaggi: client (dist/) e server per il pre-rendering (dist-server/),
// poi tools/prerender.mjs scrive l'HTML statico di ogni pagina.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react()],
  ssr: { noExternal: ['gsap', 'lenis'] },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks: { motion: ['gsap', 'lenis'] } } },
  },
}))
