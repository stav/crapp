<template>
  <v-card class="mx-auto" :loading="loading">
    <v-app-bar color="indigo">
      <v-icon class="mr-2">mdi-bitcoin</v-icon>
      Repositories
      <v-spacer />
      {{ coins.length }} coins in {{ repositorys.length }} repos
      <v-spacer />
      <span @click="coinValue=false" class="clickable text--secondary"> amount </span>
      <v-switch
        v-model="coinValue"
        class="ml-3 mr-2"
        hide-details
        title="Display amount of coins held or the USD valuation"
      />
      <span @click="coinValue=true" class="clickable text--secondary"> value </span>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="valuedRepositorys"
      v-model="selectedRows"
      show-select
      sort-by="valuation"
      hide-default-footer
      disable-pagination
      dense
      @click:row="flyRepository"
    >
      <template v-slot:body.append v-if="repositorys.length">
        <tr>
          <td v-for="header of fHeaders" :key="header.value" class="text-end">
            <v-btn
              v-if="header.value === 'name'"
              @click="() => fetchAllSparks()"
              title="Press to fetch latest history prices displayed as sparklines"
              small class="accent px-1"
            >
              Load Spark Data
            </v-btn>
            <v-sparkline
              v-if="header.coin"
              :value="sparks(header.value)"
              color="white"
              line-width="1"
              width="200"
              height="50"
            />
          </td>
        </tr>
        <tr>
          <td v-for="header of fHeaders" :key="header.value" class="text-end">
            <v-btn
              v-if="header.value === 'name'"
              @click="fetchPrices"
              title="Press to fetch latest current prices"
              small class="accent px-1"
            >
              Load Coin Data
            </v-btn>
            <v-btn
              v-if="header.coin"
              @click="() => flyCoin(header)"
              small class="accent px-1"
              v-text="header.value"
              :title="coinPrice(header.value)"
            />
          </td>
        </tr>
        <tr class="primary">
          <td v-for="header of fHeaders" :key="header.value" class="text-end">
            <span v-if="header.value === 'name'"> Total (coins) </span>
            <span
              v-if="header.coin"
              v-text="formatAmount(coinSum(header.value))"
              :title="coinSum(header.value)"
            />
          </td>
        </tr>
        <tr class="accent">
          <td v-for="header of fHeaders" :key="header.value" class="text-end">
            <span v-if="header.value === 'name'"> Price (each) </span>
            <span
              v-if="header.coin"
              v-text="`$${formatAmount(coinPrice(header.value))}`"
              :title="coinPrice(header.value)"
            />
          </td>
        </tr>
        <tr class="secondary">
          <td v-for="header of fHeaders" :key="header.value" class="text-end">
            <div v-if="header.value === 'name'" class="text-h6 text-no-wrap">
              <code> {{ formatCurrency(portfolioTotalUSD()) }} </code>
            </div>
            <span v-if="header.coin" v-text="formatCurrency(coinTotalUSD(header.value))" />
          </td>
        </tr>
      </template>
      <template v-slot:no-data><v-btn @click="$fetch"> Reset </v-btn></template>
    </v-data-table>

    <v-snackbar v-model="snackbarModel" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarModel = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-card-actions v-if="repositorys.length">
      <v-btn @click="getBinanceAccountsData"> Binance </v-btn>
      <v-btn @click="getCoinbaseAccountsData"> Coinbase </v-btn>
      <v-btn @click="getCoinbaseProAccountsData"> Coinbase Pro </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { loadRepositorys } from '@/database'
import { formatAmount, formatCurrency } from '@/utils'

export default {

  fetchOnServer: true,

  async fetch () {
    await loadRepositorys()
    console.log('fetch', this.repositorys)
    this.selectedRows = this.repositorys
    await this.fetchPrices()
  },

  data: () => ({
    // timeout: null,
    loading: false,
    snackbarText: '',
    snackbarModel: false,
    coinValue: true,
  }),

  computed: {
    Coins () {
      return this.$store.$db().model('coins')
    },
    Repositorys () {
      return this.$store.$db().model('repositorys')
    },
    /*
    ** Database data
    **
    ** Return an array of unvalued repositories
    */
    repositorys () {
      return this.Repositorys
        .query()
        .with(['coins', 'coins.coin'])
        .all()
    },
    /*
    ** Data-table data
    **
    ** Return an array of row objects
    **
    ** [{id:'$uid1', name:'Ledger', valuation:'$1,137.36',
    **   BTC:'$1,140',
    **   coins: [
    **     { id: "$uid3",
    **       coinId: "$uid2",
    **       repoId: "$uid1",
    **       quantity: 0.1} ]
    **  },...]
    */
    valuedRepositorys () {
      return this.repositorys.map(this.repoValuation)
    },
    coins () {
      const coins = this.Coins.all()
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
    /*
    ** Data-table options
    **
    ** Return an array of column settings objects
    **
    **   {"text": "", "value": "name"},
    **   {"text": "Valuation", "value": "valuation"},
    **   {"text": "BTC", "value": "BTC", "coin": true },
    **   {"text": "ETH", "value": "ETH", "coin": true },... ]
    */
    headers () {
      /*
      ** Column sorting function
      **
      ** Unfortunately the simple component from Vuetiify doesn't support rendering
      ** so we have to set the "value" pre-rendered and then un-render :) to sort
      */
      function sort (a, b) {
        const _ = _ => (_ || '0').replaceAll(',', '').replaceAll('$', '')
        a = parseFloat(_(a))
        b = parseFloat(_(b))
        if (a < b) { return 1 }
        if (a > b) { return -1 }
        return 0
      }
      /*
      ** Left-most columns (static)
      */
      const _ = [
        { text: '', value: 'name', sortable: true },
        { text: 'Valuation', value: 'valuation', align: 'end', sortable: true, sort },
      ]
      /*
      ** Right-most columns (dynamically created one for each coin)
      */
      for (const coin of this.coins) {
        _.push({
          text: coin,
          value: coin,
          align: 'end',
          sortable: true,
          coin: true,
          sort,
        })
      }
      return _
    },
    fHeaders () {
      return [{}].concat(this.headers) // Add a blank column to beginning of headers
    },
    selectedRows: {
      get () {
        return this.$store.state.selectedRepos
      },
      set (value) {
        this.$store.commit('setSelectedRepos', value)
      }
    },
  },

  mounted () {
    this.snackbarText = 'Mounted'
    this.snackbarModel = true
    // this.timeout = setInterval(this.getCoinbaseAccountsData, 10000)
  },

  methods: {
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
    formatAmount (value) {
      return formatAmount(value)
    },
    formatCurrency (value) {
      return formatCurrency(value)
    },
    coinSum (symbol) {
      return this.$store.getters.coinSum(symbol)
    },
    coinPrice (symbol) {
      return this.$store.getters.coinPriceUSD(symbol)
    },
    coinTotalUSD (symbol) {
      const amount = this.coinSum(symbol)
      const price = this.coinPrice(symbol)
      return price ? (amount * price) : ''
    },
    fetchAllSparks () {
      this.loading = 'red'
      for (const symbol of this.coins) {
        this.$store.dispatch('loadKraken', { symbol, done: this.done })
      }
    },
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
    portfolioTotalUSD () {
      return (this.coins.reduce(
        (total, symbol) => total + (this.coinTotalUSD(symbol) || 0),
        0 // starting value
      ))
    },
    flyCoin (header) {
      this.$store.commit('setFlyoutCoin', { symbol: header.value })
    },
    flyRepository (repo) {
      this.$store.commit('setFlyoutRepo', repo)
    },
    /*
    ** Repository valuation
    **
    ** Return the provided repository with the coins property evaluated
    ** with the proper coins from the database as well as a mapping to
    ** create the top-level fields, one for each coin, e.g.:
    **
    **     {BTC:1, ETH:10...}
    */
    repoValuation (repo) {
      const coins = {}
      let valuation = 0
      // First we sum the coins[symbol] values/quantities using only numeric data
      for (const coin of repo.coins) {
        const symbol = coin.coin.symbol
        const value = coin.quantity * this.coinPrice(symbol)
        valuation += value
        symbol in coins || (coins[symbol] = 0) // Init new coin counter to zero
        coins[symbol] += this.coinValue ? value : coin.quantity
      }
      // Then we format these coins[symbol] as formatted text for display
      for (const symbol in coins) {
        const amount = this.formatAmount(coins[symbol])
        coins[symbol] =
          this.coinValue
            ? this.formatCurrency(amount.replaceAll(',', '')).slice(0, -3)
            : coins[symbol] = amount
      }
      return Object.assign(repo, coins, { valuation: this.formatCurrency(valuation) })
    },
    sparks (symbol) {
      return this.$store.getters.sparkLines(symbol)
    }
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>

<style lang="scss">
.text-end {
  text-align: right !important;
}
</style>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
