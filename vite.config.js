import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Rend les feuilles de style du build non bloquantes pour le premier affichage :
// le loader en ligne de index.html s'affiche immédiatement, sans attendre le CSS.
// Le loader (opaque) reste affiché jusqu'au "load" de la page, qui attend ce CSS.
function nonBlockingCss() {
  return {
    name: 'non-blocking-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          // Uniquement les CSS générés par Vite (/assets/...), pas Google Fonts
          /<link rel="stylesheet"([^>]*?href="[^"]*\/assets\/[^"]+\.css"[^>]*?)>/g,
          `<link rel="stylesheet"$1 media="print" onload="this.media='all'"><noscript><link rel="stylesheet"$1></noscript>`
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Site servi sur https://ayosammmm.github.io/portfolio/
  base: '/portfolio/',
  plugins: [react(), nonBlockingCss()],
  server: {
    host: true,
  }
})
