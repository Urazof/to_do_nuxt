// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: [
    "vuetify/lib/styles/main.sass",
  ],
  build: {
    transpile: ["vuetify"],
  },
})
