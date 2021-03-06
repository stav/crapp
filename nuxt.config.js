import colors from 'vuetify/es5/util/colors'

export default {
  /*
  ** Nuxt server-side rendering flag
  ** See https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-ssr
  */
  ssr: true,

  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Runtime config
  **
  ** See https://nuxtjs.org/guide/runtime-config
  ** See https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config#using-your-config-values
  **
  ** \/ Can't figure out how to get the Nuxt context in a server middleware
  ** ^^ context.$config.coinbaseApiSecret is what we want
  */
  privateRuntimeConfig: {
    coinbaseApiSecret: process.env.COINBASE_API_SECRET
  },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Server Middleware
  ** See https://github.com/senchalabs/connect
  */
  serverMiddleware: [
    { path: '/api/coinmarketcap', handler: '~/api/coinmarketcap' },
    { path: '/api/cryptocompare', handler: '~/api/cryptocompare' },
    { path: '/api/coinbasepro', handler: '~/api/coinbasepro' },
    { path: '/api/coinbase', handler: '~/api/coinbase' },
    { path: '/api/bitfinex', handler: '~/api/bitfinex' },
    { path: '/api/binance', handler: '~/api/binance' },
    { path: '/api/kraken', handler: '~/api/kraken' },
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    devtools: true,
    extend(config, { isClient }) {
      if (isClient) {
        config.devtool = process.env.NODE_ENV === 'development' ? '#source-map' : ''
      }
    }
  }
}
