<template>
  <v-card class="mx-auto">
    <!-- Top bar with green button -->
    <v-app-bar>
      <v-icon>mdi-fruit-citrus</v-icon>
      <v-toolbar-title class="mx-2"> Client testing </v-toolbar-title>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col>
          <v-card :loading="loadingTradingView" max-width="374" color="blue darken-4">
            <v-card-title>TrradingView</v-card-title>
            <v-card-actions>
              <v-btn @click="testTradingViewPing"> Ping </v-btn>
              <v-btn @click="testTradingViewCoinsList"> Coins List </v-btn>
              <v-btn @click="resultTradingView = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultTradingView" root-key="resultTradingView" class="pt-0 blue lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card :loading="loadingCryptoCompare" max-width="374" color="green darken-4">
            <v-card-title>CryptoCompare</v-card-title>
            <v-card-actions>
              <v-btn @click="testCryptoCompareRates"> Rate limits </v-btn>
              <v-btn @click="testCryptoComparePrices"> Prices </v-btn>
              <v-btn @click="resultCryptoCompare = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultCryptoCompare" root-key="resultCryptoCompare" class="pt-0 green lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card :loading="loadingCoinbasePro" max-width="374" class="green darken-4">
            <v-card-title>Coinbase Pro</v-card-title>
            <v-card-actions>
              <v-btn @click="testCoinbaseProTime"> Time </v-btn>
              <v-btn @click="resultCoinbasePro = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultCoinbasePro" root-key="resultCoinbasePro" class="pt-0 green lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card :loading="loadingBinance" max-width="374" class="green darken-4">
            <v-card-title>Binance</v-card-title>
            <v-card-actions>
              <v-btn @click="testBinanceStatus"> Status </v-btn>
              <v-btn @click="resultBinance = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultBinance" root-key="resultBinance" class="pt-0 green lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card :loading="loadingBitfinex" max-width="374" class="red darken-4">
            <v-card-title>Bitfinex</v-card-title>
            <v-card-actions>
              <v-btn @click="testBitfinexStatus"> Status </v-btn>
              <v-btn @click="resultBitfinex = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultBitfinex" root-key="resultBitfinex" class="pt-0 red lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card :loading="loadingCoinMarketCap" max-width="374" class="red darken-4">
            <v-card-title>CoinMarketCap</v-card-title>
            <v-card-actions>
              <v-btn @click="testCoinMarketCap"> Quotes </v-btn>
              <v-btn @click="resultCoinMarketCap = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultCoinMarketCap" root-key="resultCoinMarketCap" class="pt-0 red lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card :loading="loadingKraken" max-width="374" class="red darken-4">
            <v-card-title>Kraken</v-card-title>
            <v-card-actions>
              <v-btn @click="testKrakenTime"> Time </v-btn>
              <v-btn @click="resultKraken = {}" text title="Clear"> X </v-btn>
            </v-card-actions>
            <v-card-text>
              <json-view :data="resultKraken" root-key="resultKraken" class="pt-0 red lighten-4" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { JSONView } from 'vue-json-component'
import qs from 'qs'

export default {

  components: { 'json-view': JSONView },

  data: () => ({
    resultKraken: {},
    loadingKraken: false,

    resultBinance: {},
    loadingBinance: false,

    resultTradingView: {},
    loadingTradingView: false,

    resultBitfinex: {},
    loadingBitfinex: false,

    resultCoinbasePro: {},
    loadingCoinbasePro: false,

    resultCryptoCompare: {},
    loadingCryptoCompare: false,

    resultCoinMarketCap: {},
    loadingCoinMarketCap: false,
  }),

  methods: {
    /*
    ** testTradingViewPing
    **
    ** https://www.coingecko.com/api/documentations/v3
    ** https://www.coingecko.com/en/api#explore-api
    **
    ** https://assets.coingecko.com/reports/API/CoinGecko-API-Deck.pdf
    ** ...we request that you include a linked attribution to our website.
    ** An example would be adding a “Powered by CoinGecko API” link in your app.
    ** For image assets... https://www.coingecko.com/en/branding
    */
    async testTradingViewPing () {
      this.loadingTradingView = true
      const url = 'https://api.coingecko.com/api/v3/ping'
      const result = await this.fetchJson({ url })
      console.log('testTradingViewPing', result)
      this.resultTradingView = result
      this.loadingTradingView = false
    },
    /*
    ** testTradingViewCoinsList
    */
    async testTradingViewCoinsList () {
      this.loadingTradingView = true
      const url = 'https://api.coingecko.com/api/v3/coins/list'
      const result = await this.fetchJson({ url })
      console.log('testTradingViewCoinsList', result)
      this.resultTradingView = result.slice(1000, 1010)
      this.loadingTradingView = false
    },
    /*
    ** testKrakenTime
    **
    ** Not working:
    **
    **   Returning 200 from the server, but FireFox complains
    **   CORS header ‘Access-Control-Allow-Origin’ missing
    **   Actually no access headers sent back in the response
    */
    async testKrakenTime () {
      this.loadingKraken = true
      const url = 'https://api.kraken.com/0/public/Time'
      const result = await this.fetchJson({ url })
      console.log('testKrakenTime', result)
      this.resultKraken = result
      this.loadingKraken = false
    },
    /*
    ** testBinanceStatus
    **
    ** Not working:
    **
    **   Returning 200 from the server, but FireFox complains
    **   CORS header ‘Access-Control-Allow-Origin’ missing
    **   Actually no access headers sent back in the response
    */
    async testBinanceStatus () {
      this.loadingBinance = true
      const url = 'https://api.binance.com/wapi/v3/systemStatus.html'
      const result = await this.fetchJson({ url })
      console.log('testBinanceStatus', result)
      this.resultBinance = result
      this.loadingBinance = false
    },
    /*
    ** testCoinbaseProTime
    **
    ** Working (response headers):
    **
    **   access-control-expose-headers: cb-before, cb-after, cb-gdpr
    **   access-control-allow-headers: Content-Type, Accept, cb-session, cb-fp, cb-form-factor
    **   access-control-allow-methods: GET,POST,DELETE,PUT
    **   access-control-allow-origin: *
    **   access-control-max-age: 7200
    */
    async testCoinbaseProTime () {
      this.loadingCoinbasePro = true
      const url = 'https://api.pro.coinbase.com/time'
      const result = await this.fetchJson({ url })
      console.log('testCoinbaseProTime', result)
      this.resultCoinbasePro = result
      this.loadingCoinbasePro = false
    },
    /*
    ** testBitfinexStatus
    **
    ** Not working:
    **
    **   Returning 200 from the server, but FireFox complains
    **   CORS header ‘Access-Control-Allow-Origin’ missing
    **   Actually no access headers sent back in the response
    */
    async testBitfinexStatus () {
      this.loadingBitfinex = true
      const url = 'https://api-pub.bitfinex.com/v2/platform/status'
      const result = await this.fetchJson({ url })
      console.log('testBitfinexStatus', result)
      this.resultBitfinex = result
      this.loadingBitfinex = false
    },
    /*
    ** testCoinMarketCap
    **
    ** Note: Making HTTP requests on the client side with Javascript is currently prohibited
    ** through CORS configuration. This is to protect your API Key which should not be visible
    ** to users of your application so your API Key is not stolen. Secure your API Key by routing
    ** calls through your own backend service.
    **
    ** Not working:
    **
    **   Returning 200 from the server, but FireFox complains
    **   CORS header ‘Access-Control-Allow-Origin’ missing
    **   Some access headers are sent back in the response
    */
    async testCoinMarketCap () {
      this.loadingCoinMarketCap = true
      const params = {
        symbol: 'BTC,ETH',
      }
      const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
      const result = await this.fetchJson({ url, params })
      console.log('testCoinMarketCap', result)
      this.resultCoinMarketCap = result
      this.loadingCoinMarketCap = false
    },
    /*
    ** testCryptoCompareRates
    **
    ** Working
    */
    async testCryptoCompareRates () {
      this.loadingCryptoCompare = true
      const url = 'https://min-api.cryptocompare.com/stats/rate/limit'
      const result = await this.fetchJson({ url })
      console.log('testCryptoCompareRates', result)
      this.resultCryptoCompare = result
      this.loadingCryptoCompare = false
    },
    /*
    ** testCryptoComparePrices
    **
    ** Working:
    */
    async testCryptoComparePrices () {
      this.loadingCryptoCompare = true
      const symbols = this.$store.getters.sortedUniqueSymbols.filter(_ => _)
      const symbolsUnlisted = this.$store.getters.symbolsUnlisted
      let symbolsListed = symbols.filter(coin => !symbolsUnlisted.includes(coin))
      if (symbolsListed.length === 0) {
        console.warn('No coins, try viewing the repositories page first.')
        symbolsListed = ['BTC', 'ETH']
      }
      const params = {
        tsyms: 'USD',
        fsyms: symbolsListed.join(','),
        extraParams: 'CrApp',
      }
      const url = 'https://min-api.cryptocompare.com/data/pricemulti'
      const result = await this.fetchJson({ url, params })
      console.log('testCryptoComparePrices', result)
      this.resultCryptoCompare = result
      this.loadingCryptoCompare = false
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
