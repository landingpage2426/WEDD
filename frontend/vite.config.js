import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou vue, selon ton projet
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'images/logo.png'],
      manifest: {
        name: 'Wedd',
        short_name: 'Wedd',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        description: "Plateforme de gestion de mariage avec génération automatisée de billets numériques en PDF intégrant les données dynamiques de l’invité (nom, statut, numéro de table). Chaque billet contient un QR code unique permettant un scan rapide à l’entrée, une gestion en temps réel des présences, et une organisation optimale du plan de salle.",
        icons: [
          {
            src: '/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      }, workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
      },
    })
  ],
})
