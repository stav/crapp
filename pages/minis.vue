<template>
  <v-card class="mx-auto">
    <v-app-bar :color="sheetColor">
      <v-icon class="mr-2">mdi-chart-line-variant</v-icon> Minis
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-btn @click="tradingView" color="primary"> TradingView </v-btn>
          <v-btn
            v-for="symbol of symbols" :key="symbol"
            @click="() => chart(symbol)"
            v-text="symbol"
            :disabled="disabled(symbol)"
            :color="color(symbol)"
            class="mr-1 mb-1"
          />
        </v-col>
        <v-col cols="10">
          <v-container>
            <v-row no-gutters>
              <v-col v-for="(exchangeSymbolPair, symbol) in sparks" :key="symbol">
                <v-card class="ma-1" max-width="200">
                  <v-sheet :color="sheetColor" width="200">
                    <v-btn @click="() => flyCoin(symbol, true)" color="primary" v-text="symbol" title="Fly coin" />
                    <!-- TradingView Widget BEGIN -->
                    <div class="tradingview-widget-container">
                      <div class="tradingview-widget-container__widget" />
                      <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
                        {
                        "symbol": "{{ exchangeSymbolPair }}",
                        "width": "200",
                        "height": "180",
                        "locale": "en",
                        "dateRange": "6M",
                        "colorTheme": "dark",
                        "trendLineColor": "#37a6ef",
                        "underLineColor": "rgba(0, 255, 255, 0.15)",
                        "isTransparent": true,
                        "autosize": false,
                        "largeChartUrl": ""
                        }
                      </script>
                    </div>

                    <!-- TradingView Widget END -->
                  </v-sheet>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import qs from 'qs'

const COLOR = 'blue darken-4'

export default {

  /*
  ** FETCH
  */
  fetch () {
    this.$store.dispatch('loadRepositorys')
  },

  /*
  ** DATA
  */
  data: () => ({
    disableds: {},
    sparks: {}, // { ADA: "COINBASE:BTCUSD" }
    colors: {},
    sheetColor: COLOR,
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
      return this.$store.getters.sortedUniqueSymbols // .splice(0, 10)
    },
  },

  /*
  ** METHODS
  */
  methods: {

    color (symbol) {
      return this.colors[symbol] || 'accent'
    },

    disabled (symbol) {
      return this.disableds[symbol]
    },

    async getTradingViewSymbol (symbol) {
      const state = this.$store.state
      if (symbol in state.tradingviewSymbols) {
        return state.tradingviewSymbols[symbol]
      }
      const url = '/api/tradingview/search'
      const pair = `${symbol}USD`
      const params = { pair }
      const data = await this.fetchJson({ url, params })
      console.log('getTradingViewSymbol', data)
      const result = data.search[0] || {}
      const string = `${result.exchange}:${pair}`
      state.tradingviewSymbols[symbol] = string
      this.$store.commit('setTradingviewSymbol', { symbol, string })
      // this.resultCryptoCompare = result
      return string
    },

    async chart (symbol) {
      this.flyCoin(symbol)
      const data = await this.getTradingViewSymbol(symbol)
      if (data.length) {
        const value = {}
        value[symbol] = data
        this.sparks = Object.assign({}, this.sparks, value)
        const color = {}
        color[symbol] = COLOR
        this.colors = Object.assign({}, this.colors, color)
      }
    },

    flyCoin (symbol, flyout = false) {
      if (flyout) {
        this.$store.commit('setFlyoutDrawer', true)
      }
      this.$store.commit('setFlyoutCoin', { symbol })
      this.$store.commit('openCoinFlyout')
    },

    async tradingView () {
      for (const symbol of this.symbols) {
        await this.chart(symbol)
      }
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

}
</script>

<style scoped>
  .tradingview-widget-container :hover {
    cursor: pointer;
  }
</style>
