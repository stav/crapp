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
      const coinsUnlisted = this.$store.getters.coinsUnlisted
      let coinsListed = symbols.filter(coin => !coinsUnlisted.includes(coin))
      if (coinsListed.length === 0) {
        console.warn('No coins, try viewing the repositories page first.')
        coinsListed = ['BTC', 'ETH']
      }
      const params = {
        tsyms: 'USD',
        fsyms: coinsListed.join(','),
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
    ** cryptocompare.com
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
}
</script>
