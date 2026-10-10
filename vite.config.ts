import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ARTIFACT=1 produce un unico bundle (niente chunk dinamici) da incorporare nell'anteprima.
const single = process.env.ARTIFACT === '1'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: single
        ? { inlineDynamicImports: true }
        : { manualChunks: { three: ['three', '@react-three/fiber'], motion: ['gsap', 'lenis'] } },
    },
  },
})
