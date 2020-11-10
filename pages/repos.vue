<template>
  <v-card class="mx-auto" :loading="loading">
    <repo-bar :repositorys="repositorys" :coins="coins" />

    <repo-table :repositorys="repositorys" :coins="coins" />

    <v-snackbar v-model="snackbarModel" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarModel = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-card-actions v-if="repositorys.length">
      <v-btn
        @click="() => fetchAllSparks()"
        title="Press to fetch latest history prices displayed as sparklines"
        small class="accent px-1"
      >
        Load Spark Data
      </v-btn>
      <v-btn
        @click="fetchPrices"
        title="Press to fetch latest current prices"
        small class="accent px-1"
      >
        Load Coin Data
      </v-btn>
      <v-btn @click="getBinanceAccountsData"> Binance </v-btn>
      <v-btn @click="getCoinbaseAccountsData"> Coinbase </v-btn>
      <v-btn @click="getCoinbaseProAccountsData"> Coinbase Pro </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { loadRepositorys } from '@/database'
import repoTable from '../components/RepoTable.vue'
import repoBar from '../components/RepoBar.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'repo-bar': repoBar,
    'repo-table': repoTable,
  },

  /*
  ** FETCH
  */
  async fetch () {
    await loadRepositorys()
    console.log('fetch', this.repositorys)
    this.$store.commit('setSelectedRepos', this.repositorys)
    await this.fetchPrices()
  },

  /*
  ** DATA
  */
  data: () => ({
    // timeout: null,
    loading: false,
    snackbarText: '',
    snackbarModel: false,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** Database data
    **
    ** Return an array of unvalued repositories
    */
    repositorys () {
      return this.$store.$db()
        .model('repositorys')
        .query()
        .with(['coins', 'coins.coin'])
        .all()
    },
    coins () {
      const coins = this.$store.$db().model('coins').all()
      const uniqueCoins = new Set(coins.map(coin => coin.symbol))
      const sortedUniqueCoins = Array.from(uniqueCoins).sort()
      return sortedUniqueCoins
    },
    coinsListed () {
      const coinsUnListed = this.$store.getters.coinsUnListed()
      return this.coins.filter(coin => !coinsUnListed.includes(coin))
    },
    priceFetcherUrl () {
      return '/api/coinmarketcap/quotes?symbol=' + this.coinsListed.join(',')
    },
  },

  /*
  ** MOUNTED
  */
  mounted () {
    this.snackbarText = 'Mounted'
    this.snackbarModel = true
    // this.timeout = setInterval(this.getCoinbaseAccountsData, 10000)
  },

  /*
  ** METHODS
  */
  methods: {
    /*
    ** fetchPrices
    **
    ** Fetch current market prices for all coins in all repositories
    **
    ** result = {
    **   quotes: {
    **     data: { BTC:{…}, ETH:{…}, … },
    **     status: {…}
    **   }
    ** }
    **
    ** data = {
    **   BTC: Object { id: 1, name: "Bitcoin", symbol: "BTC", … },
    **   ETH: Object { id: 1027, name: "Ethereum", symbol: "ETH", … },
    **   {…}
    ** }
    **
    ** coinData = {
    **   id: 1,
    **   symbol: "BTC",
    **   name: "Bitcoin",
    **   slug: "bitcoin",
    **   quote: { USD: { price: 13814.127956929022, … } },…
    ** }
    **
    ** coin =
    **   { symbol: "BTC", price: 13814.127956929022 }
    **
    ** unlisted = [ "CGLD", "USD" ]
    **
    ** coinsUnlisted = [ "USD" ]
    */
    async fetchPrices () {
      // Fetch & Store coin prices from CoinMarketCap
      this.loading = 'white'
      const response = await fetch(this.priceFetcherUrl)
      const result = await response.json()
      if (result.error) {
        const e = result.error
        this.snackbarText = `Error: ${e.message}, ${e.text}`
      } else {
        const { quotes: { data } } = result
        for (const coinData of Object.values(data)) {
          this.$store.dispatch('setCoin', {
            symbol: coinData.symbol,
            price: coinData.quote.USD?.price,
            name: coinData.name,
            slug: coinData.slug,
          })
        }
        if (this.coins.includes('USD')) {
          this.$store.dispatch('setCoin', { symbol: 'USD', price: 1 })
        }
        const unlisted = this.$store.getters.coinsUnListed()
        const coinsUnListed = this.coins.filter(coin => unlisted.includes(coin))
        const exceptions = coinsUnListed.length ? `(except ${coinsUnListed})` : ''
        this.snackbarText = `Loaded prices ${exceptions}`
      }
      this.snackbarModel = true
      this.loading = false
    },
    fetchAllSparks () {
      this.loading = 'red'
      for (const symbol of this.coins) {
        this.$store.dispatch('loadKraken', { symbol, done: this.done })
      }
    },
    getCoinbaseProAccountsData () {
      this.loading = 'blue'
      this.$store.dispatch('loadCoinbaseProAccounts', this.done)
    },
    getCoinbaseAccountsData () {
      this.loading = 'yellow'
      this.$store.dispatch('loadCoinbaseAccounts', this.done)
    },
    getBinanceAccountsData () {
      this.loading = 'green'
      this.$store.dispatch('loadBinanceBalances', this.done)
    },
    done (message) {
      if (message) {
        this.snackbarText = message
        this.snackbarModel = true
      }
      this.loading = false
    },
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
