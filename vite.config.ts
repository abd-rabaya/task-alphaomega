import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
    targets: [{ src: "src/index.html", dest: "" },
    { src: "node_modules/scichart/_wasm/scichart2d.data", dest: "" },
    { src: "node_modules/scichart/_wasm/scichart2d.wasm", dest: "" },]
  }) ,
   react()],
})
