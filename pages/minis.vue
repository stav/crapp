<template>
  <v-card class="mx-auto">
    <v-app-bar :color="sheetColor">
      <v-icon class="mr-2">mdi-chart-line-variant</v-icon>
      Minis
      <v-btn icon @click="tradingViewChartAll" title="Reload all mini charts"><v-icon>mdi-reload</v-icon></v-btn>
      <v-btn icon @click="tradingViewCloseAll" title="Close all mini charts" class="negative-margin"><v-icon>mdi-close</v-icon></v-btn>
      <v-btn icon @click="showCoins = !showCoins" title="Toggle coin buttons" class="negative-margin"><v-icon>mdi-circle-multiple-outline</v-icon></v-btn>
      <v-btn icon @click="showScale = !showScale" title="Toggle time scales" class="negative-margin"><v-icon>mdi-calendar-clock</v-icon></v-btn>
      <div v-if="showScale" class="scales">
        <v-select
          :items="tradingviewTimeScales"
          v-model="tradingviewTimeScale"
          dense outlined hide-details
        />
      </div>
      <div v-if="showCoins">
        <v-btn
          v-for="symbol of symbols" :key="symbol"
          @click="() => tradingViewChart(symbol)"
          v-text="symbol"
          :color="color(symbol)"
          x-small class="mr-1"
        />
      </div>
    </v-app-bar>
    <v-card
      v-for="(exchangeSymbolPair, symbol) in sparks" :key="symbol"
      :id="exchangeSymbolPair"
      class="d-inline-flex"
      max-width="200"
    >
      <v-sheet :color="sheetColor" width="200" class="ml-1 mt-1">
        <v-container class="pa-0">
          <v-row no-gutters>
            <v-col>
              <v-btn @click="() => flyCoin(symbol, true)" v-text="symbol" color="primary" title="Fly coin" />
            </v-col>
            <v-col align-self="end" class="text-right">
              <v-btn icon @click="(e) => unSpark(symbol, e)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <!-- TradingView Widget BEGIN -->
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget" />
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
            {
            "symbol": "{{ exchangeSymbolPair }}",
            "width": "200",
            "height": "180",
            "locale": "en",
            "dateRange": "{{ tradingviewTimeScale }}",
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
  </v-card>
</template>

<script>
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
    sparks: {}, // { ADA: "COINBASE:BTCUSD" }
    colors: {},
    sheetColor: COLOR,
    showCoins: false,
    showScale: false,
    tradingviewTimeScales: ['1D', '1M', '3M', '1Y', '5Y', 'All'],
    tradingviewTimeScale: '1D',
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

    async tradingViewChart (symbol) {
      this.flyCoin(symbol)
      const data = await this.$store.getters.getTradingViewSymbol(this.symbol)
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

    unSpark (symbol, self) {
      console.log('unSpark', symbol, this.sparks, self)
      const sparks = Object.assign({}, this.sparks)
      delete sparks[symbol]
      this.sparks = Object.assign({}, sparks)

      const colors = Object.assign({}, this.colors)
      delete colors[symbol]
      this.colors = Object.assign({}, colors)
    },

    tradingViewChartAll () {
      for (const symbol of this.symbols) {
        this.tradingViewChart(symbol)
      }
    },

    tradingViewCloseAll () {
      this.sparks = Object.assign({})
      this.colors = Object.assign({})
    },

  },

}
</script>

<style scoped>
  .tradingview-widget-container :hover {
    cursor: pointer;
  }
  .negative-margin {
    margin-left: -10px;
  }
  .scales {
    width: min-content;
  }
</style>
