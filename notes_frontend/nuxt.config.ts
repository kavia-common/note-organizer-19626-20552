/**
 * Nuxt configuration for Ocean Notes
 * - Adds global CSS
 * - Opens dev server to 0.0.0.0 for preview
 * - Sets simple CORS headers for previews
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  app: {
    head: {
      title: 'Ocean Notes',
      meta: [
        { name: 'theme-color', content: '#EC4899' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Playful and vibrant notes manager' }
      ],
      link: [
        { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>' }
      ]
    }
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
