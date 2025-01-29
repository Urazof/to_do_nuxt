// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
      '@pinia/nuxt',
      '@nuxt/test-utils/module',
  ],

  css: [
    'vuetify/lib/styles/main.sass',
  ],

  build: {
    transpile: ["vuetify"],
  },

  nitro: {
    plugins: ['~/server/index.ts'],
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
  },

  compatibilityDate: '2024-12-30',
})