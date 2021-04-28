<template>
  <v-app-bar fixed app collapse-on-scroll clipped-left clipped-right>
    <v-app-bar-nav-icon title="Toggle navigation drawer" @click.stop="navDrawer=!navDrawer" />

    <v-btn icon @click.stop="navVariant = !navVariant">
      <v-icon>mdi-{{ `chevron-${navVariant ? 'right' : 'left'}` }}</v-icon>
    </v-btn>

    <v-btn icon @click.stop="toggleFooterAbsolute" title="Toggle footer absolute">
      <v-icon>mdi-minus</v-icon>
    </v-btn>

    <v-toolbar-title id="crapp-title"> CrApp </v-toolbar-title>

    <v-card :loading="loading" v-if="weHaveCoins">
      <v-card-actions>
        <v-btn
          @click="loadPrices"
          title="Press to fetch latest prices"
          small icon class="accent"
        >
          <v-icon>mdi-currency-usd</v-icon>
        </v-btn>
        <v-btn
          @click="loadCoinsData"
          title="Press to fetch general coin data"
          small icon class="accent"
        >
          <v-icon>mdi-currency-btc</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-spacer />
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container" v-if="going">
      <div class="tradingview-widget-container__widget" />
      <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js" async>
        {
        "symbols": [
        { "proName": "FX_IDC:CNYEUR", "title": "元 / Euro" },
        { "proName": "FX_IDC:EURUSD"   },
        { "proName": "COINBASE:BTCUSD" },
        { "proName": "COINBASE:ETHUSD" },
        { "proName": "COINBASE:ETHBTC" },
        { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
        { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" }
        ],
        "colorTheme": "dark",
        "isTransparent": true,
        "showSymbolLogo": true,
        "locale": "en"
        }
      </script>
    </div>
    <!-- TradingView Widget END -->

    <v-btn icon @click.stop="toggleFlyout" title="Toggle coin/repo flyout">
      <v-icon>mdi-bitcoin</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {

  /*
  ** DATA
  */
  data: () => ({
    loading: false,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    going () {
      return this.$store.state.going
    },
    navDrawer: {
      get () {
        return this.$store.state.navDrawer
      },
      set (value) {
        this.$store.commit('setNavDrawer', value)
      }
    },
    navVariant: {
      get () {
        return this.$store.state.navVariant
      },
      set (value) {
        this.$store.commit('setNavVariant', value)
      }
    },
    weHaveCoins () {
      return Boolean(this.$store.getters.sortedUniqueSymbols.length)
    },
  },

  /*
  ** METHODS
  */
  methods: {
    loadPrices () {
      this.loading = 'accent'
      this.$store.dispatch('fetchPrices', this.done)
    },
    loadCoinsData () {
      this.loading = 'accent'
      this.$store.dispatch('fetchCoins', this.done)
    },
    toggleFooterAbsolute () {
      this.$store.commit('toggleFooterAbsolute')
    },
    toggleFlyout () {
      this.$store.commit('toggleFlyout')
    },
    done (message) {
      if (message) {
        this.$store.commit('snackMessage', message)
      }
      this.loading = false
    },
  },

}
</script>

<style scoped>
  #crapp-title {
    width: 75px;
    margin-right: 5px;
  }
</style>
