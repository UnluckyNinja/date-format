// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  app: {
    head: {
      title: 'Date Time Format Playground',
      meta: [{
        name: 'description',
        content: 'A playground to try and experiment various combinations of `Intl.DateTimeFormat`.'
      }],
      htmlAttrs: {
        lang: 'en',
      },
    },
    
    
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  }
})