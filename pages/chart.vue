<template>
  <div>
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container">
      <div id="tradingview_1d007" />
    </div>
    <!-- TradingView Widget END -->
    <v-btn
      v-for="symbol of symbols" :key="symbol" v-text="symbol"
      @click="() => loadSymbol(symbol)"
    />
  </div>
</template>

<script>
// https://github.com/aegonplatform/vue-tradingview-widgets/blob/master/src/components/EconomicCalendar.vue
export default {

  /*
  ** FETCH
  */
  fetch () {
    this.$store.dispatch('loadRepositorys')
  },

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** symbols
    **
    ** [ "BTC", "ETH", "LINK", … ]
    */
    symbols () {
      return this.$store.getters.sortedUniqueSymbols
    },
  },

  /*
  ** MOUNTED
  */
  async mounted () {
    await this.loadSymbol()
  },

  /*
  ** METHODS
  */
  methods: {
    async loadSymbol (symbol) {
      this.symbol = symbol || this.$store.state.flyoutCoin?.symbol
      if (this.symbol) {
        this.$store.dispatch('flyCoin', this.symbol)
        await this.$store.dispatch('cacheTickers', [this.symbol])
        const tradingviewSymbol = await this.$store.getters.getTradingViewSymbol(this.symbol)
        console.info('tradingviewSymbol', tradingviewSymbol)

        if (tradingviewSymbol) {
          // https://github.com/mmmy/css3demos/wiki/Widget-Constructor
          // eslint-disable-next-line new-cap, no-new
          new window.TradingView.widget(
            {
              width: '100%',
              height: 610,
              symbol: tradingviewSymbol,
              interval: 'D',
              timezone: 'Etc/UTC',
              theme: 'dark',
              style: '1',
              locale: 'en',
              toolbar_bg: '#f1f3f6',
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: 'tradingview_1d007'
            }
          )
        } else {
          this.$store.commit('snackMessage', `${this.symbol} has no exchanges available for TradingView`)
        }
      }
    },
  },

  /*
  ** HEAD
  **
  ** https://vue-meta.nuxtjs.org/api/#script
  */
  // This doesn't seem to work so it is included in global head
  // head: () => ({
  //   script: [
  //     { src: 'https://s3.tradingview.com/tv.js' },
  //     {
  //       type: 'text/javsscript',
  //       async: true,
  //       defer: true,
  //     },
  //   ],
  // }),

}
</script>
