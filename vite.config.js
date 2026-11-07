import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// La web vive en la raíz de su subdominio de anmarproductions.com.
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Anmar Eventos — Cotizador de bodas',
        short_name: 'Anmar Eventos',
        description: 'Arma tu paquete de foto y video para tu boda en segundos.',
        lang: 'es',
        theme_color: '#FAF6F0',
        background_color: '#FAF6F0',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallbackDenylist: [/^\/datos\//],
        runtimeCaching: [
          {
            // Los precios siempre se piden frescos; la copia guardada solo se usa sin señal.
            urlPattern: /\/datos\/.*\.json/,
            handler: 'NetworkFirst',
            options: { cacheName: 'datos', networkTimeoutSeconds: 4 }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fuentes', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
})
