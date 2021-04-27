<template>
  <div>
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container">
      <div id="tradingview_1d007" />
      <!--
      <script type="text/javascript" defer>
        new window.TradingView.widget(
        {
          "width": 980,
          "height": 610,
          "symbol": "COINBASE:ETHUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_1d007"
        }
        );
      </script> -->
    </div>
    <!-- TradingView Widget END -->
    <v-btn
      v-for="symbol of symbols" :key="symbol" v-text="symbol"
      @click="() => loadSymbol(symbol)"
    />
  </div>
</template>

<script>
import qs from 'qs'

// https://github.com/aegonplatform/vue-tradingview-widgets/blob/master/src/components/EconomicCalendar.vue
export default {

  /*
  ** DATA
  */
  data: () => ({
  }),

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
  mounted() {
    console.log('window', window)
    this.assign()
  },

  /*
  ** METHODS
  */
  methods: {
    async loadSymbol (symbol) {
      this.symbol = symbol || this.$store.state.flyoutCoin?.symbol
      await this.assign()
    },
    async assign () {
      if (this.symbol) {
        this.$store.dispatch('flyCoin', this.symbol)
        // https://github.com/mmmy/css3demos/wiki/Widget-Constructor
        // eslint-disable-next-line new-cap, no-new
        new window.TradingView.widget(
          {
            width: '100%',
            height: 610,
            symbol: await this.getTradingViewSymbol(),
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
      }
    },
    async getTradingViewSymbol () {
      const state = this.$store.state
      if (this.symbol in state.tradingviewSymbols) {
        return state.tradingviewSymbols[this.symbol]
      }
      const url = '/api/tradingview/search'
      const pair = `${this.symbol}USD`
      const params = { pair }
      const data = await this.fetchJson({ url, params })
      console.log('getTradingViewSymbol', data)
      const result = data.search[0] || {}
      const string = `${result.exchange}:${pair}`
      state.tradingviewSymbols[this.symbol] = string
      this.$store.commit('setTradingviewSymbol', { symbol: this.symbol, string })
      // this.resultCryptoCompare = result
      return string
    },
    /*
    ** fetchJson
    **
    **   {
    **     "Response": "Error",
    **     "Message": "Path does not exist",
    **     "Type": 0,
    **     "Data": {}
    **   }
    */
    async fetchJson ({ url, params = null, headers = {}, _data = {} } = {}) {
      let response
      if (params) {
        url = `${url}?${qs.stringify(params)}`
      }
      console.log('fetchJson', url)
      try {
        response = await fetch(url, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: 'same-origin', // include, *same-origin, omit
          headers: Object.assign({
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Request-Method': 'POST',
            Accept: 'application/json',
          }, headers),
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'same-origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
      } catch (error) {
        console.error(error)
        this.$store.commit('snackMessage', error)
        return { error: error.message }
      }
      return response.json()
    },
  },

  /*
  ** HEAD
  **
  ** https://vue-meta.nuxtjs.org/api/#script
  */
  head: () => ({
    script: [
      // { src: 'https://s3.tradingview.com/tv.js' },
      // {
      //   type: 'text/javsscript',
      //   async: true,
      //   defer: true,
      // },
    ],
  }),

}
</script>
