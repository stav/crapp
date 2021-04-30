import colors from 'vuetify/es5/util/colors'
import webpack from 'webpack'
import { version } from './package.json'

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
  ** See https://nuxtjs.org/guides/configuration-glossary/configuration-servermiddleware
  **
  ** \/ Can't figure out how to get the Nuxt context in a server middleware
  ** ^^ context.$config.someValue is what we want
  */
  // privateRuntimeConfig: {
  //   someValue: process.env.someValueNotInRepository
  // },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'CrApp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://s3.tradingview.com/tv.js' } // only needed for pages/chart.vue
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
    { path: '/api/tradingview', handler: '~/api/tradingview' },
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
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(version),
        // The following do not seem to work as VUE_APP_BINANCE_API_KEY, etc in .env
        'process.env.BINANCE_API': !!process.env.BINANCE_API_KEY,
        'process.env.COINBASE_API': !!process.env.COINBASE_API_KEY,
        'process.env.COINBASEPRO_API': !!process.env.COINBASEPRO_API_KEY,
      })
    ],
  }
}
