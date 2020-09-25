<template>
  <v-card class="mx-auto" :loading="loading">
    <v-app-bar color="indigo">
      <v-icon class="mr-2">mdi-bitcoin</v-icon>
      Repositories
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="repositorys"
      hide-default-footer
      @click:row="flyRepository"
    >
      <template v-slot:body.append v-if="repositorys.length">
        <tr class="primary">
          <td v-for="header of headers" :key="header.value">
            <span v-if="header.value === 'name'"> Total (coins) </span>
            <span
              v-if="header.coin"
              v-text="formatAmount(coinSum(header.value))"
              :title="coinSum(header.value)"
            />
          </td>
        </tr>
        <tr class="accent">
          <td v-for="header of headers" :key="header.value">
            <v-btn
              v-if="header.value === 'name'"
              @click="fetchPrices"
              title="Press to fetch latest prices"
              small class="accent px-1"
            >
              Price (each)
            </v-btn>
            <v-btn
              v-if="header.coin"
              @click="() => flyCoin(header)"
              small class="accent px-1"
              v-text="`$${formatAmount(coinPrice(header.value))}`"
              :title="coinPrice(header.value)"
            />
          </td>
        </tr>
        <tr class="secondary">
          <td v-for="header of headers" :key="header.value">
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
import Repository from '~/models/Repository'
import repositorys from '~/data/repositorys'

export default {

  fetchOnServer: true,

  async fetch () {
    loadRepositorys(await repositorys())
    console.log('fetch', Repository.query().with(['coins', 'coins.coin']).all())
    await this.fetchPrices()
  },

  data: () => ({
    // timeout: null,
    loading: false,
    snackbarText: '',
    snackbarModel: false,
  }),

  computed: {
    Coins () {
      return this.$store.$db().model('coins')
    },
    Repositorys () {
      return this.$store.$db().model('repositorys')
    },
    repositorys () {
      return this.Repositorys
        .query()
        .with('coins')
        .with('coins.coin')
        .get()
        .map((repo) => {
          const coins = {}
          for (const coin of repo.coins) {
            coins[coin.coin.symbol] = this.formatAmount(coin.quantity)
          }
          return Object.assign(repo, coins)
        })
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
    headers () {
      const _ = [
        { text: '', value: 'actions', sortable: false },
        { text: '', value: 'name', sortable: false },
      ]
      for (const coin of this.coins) {
        _.push({ text: coin, value: coin, coin: true })
      }
      return _
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
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
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
        for (const coin of Object.values(data)) {
          this.$store.dispatch('setPriceUSD', { symbol: coin.symbol, price: coin.quote.USD?.price })
        }
        if (this.coins.includes('USD')) {
          this.$store.dispatch('setPriceUSD', { symbol: 'USD', price: 1 })
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
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
