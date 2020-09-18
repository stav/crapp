<template>
  <v-card class="mx-auto" :loading="loading">
    <v-app-bar color="indigo">
      <v-icon class="mr-2">mdi-bitcoin</v-icon>
      Repositories
    </v-app-bar>

    <v-data-table :headers="headers" :items="repositorys" hide-default-footer>
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
            <span v-if="header.value === 'name'" v-text="formatCurrency(portfolioTotalUSD())" />
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
import Coin from '~/models/Coin'
import Repository from '~/models/Repository'
import repositorys from '~/data/repositorys'

const coinMarketCapUnlisted = ['CGLD']

export default {

  fetchOnServer: true,

  async fetch () {
    Repository.create({ data: await repositorys() }) // TODO: only create if empty?
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
      const _ = this.Repositorys.query().with('coins').get()
      return _.map((repo) => {
        const coins = {}
        for (const coin of repo.coins) {
          coins[coin.symbol] = this.formatAmount(coin.quantity)
        }
        return Object.assign(repo, coins)
      })
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
    coins () {
      const coins = this.Coins.all()
      const uniqueCoins = new Set(coins.map(coin => coin.symbol))
      const sortedUniqueCoins = Array.from(uniqueCoins).sort()
      return sortedUniqueCoins
    },
    priceFetcherUrl () {
      const coinsList = this.coins.filter(coin => !coinMarketCapUnlisted.includes(coin)).join(',')
      return '/api/coinmarketcap/quotes?symbol=' + coinsList
    },
  },

  mounted () {
    this.snackbarText = 'Mounted'
    this.snackbarModel = true
    // this.timeout = setInterval(this.getCoinbaseAccountsData, 10000)
  },

  methods: {
    async getCoinbaseProAccountsData () {
      this.loading = 'blue'
      const response = await fetch('/api/coinbasepro/accounts')
      let accounts = response.status === 200 ? await response.json() : { status: response.status }
      accounts = accounts.filter(account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold))
      this.snackbarText = `${accounts.length} accounts retrieved and loading into Coinbase Pro`
      this.snackbarModel = true
      this.loadCoinbaseProAccounts(accounts)
      this.loading = false
    },
    loadCoinbaseProAccounts (accounts) {
      const repos = this.Repositorys.query().with('coins')
      const coinbasepro = repos.where('name', 'Coinbase Pro').first()

      for (const account of accounts) {
        const coin = coinbasepro.coins.find(coin => coin.symbol === account.currency)
        Coin.insertOrUpdate({
          data: {
            id: coin?.id,
            name: coin?.name || account.currency,
            symbol: account.currency,
            quantity: account ? parseFloat(account.balance) : 0,
            repoId: coinbasepro.id,
          }
        })
      }
    },
    async getCoinbaseAccountsData () {
      this.loading = 'yellow'
      const response = await fetch('/api/coinbase/v2/accounts')
      let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
      accounts = accounts.filter(account => parseFloat(account.balance.amount))
      this.snackbarText = `${accounts.length} accounts retrieved and loading into Coinbase`
      this.snackbarModel = true
      this.loadCoinbaseAccounts(accounts)
      this.loading = false
    },
    loadCoinbaseAccounts (accounts) {
      // TODO: Error handling
      const repos = this.Repositorys.query().with('coins')
      const coinbase = repos.where('name', 'Coinbase').first()

      for (const account of accounts) {
        const coin = coinbase.coins.find(coin => coin.symbol === account.currency)
        Coin.insertOrUpdate({
          data: {
            id: coin?.id,
            name: coin?.name || account.currency,
            symbol: account.currency,
            quantity: account ? parseFloat(account.balance.amount) : 0,
            repoId: coinbase.id,
          }
        })
      }
    },
    async getBinanceAccountsData () {
      this.loading = 'green'
      const response = await fetch('/api/binance/balances')
      const { balances } = response.status === 200 ? await response.json() : { status: response.status }
      this.snackbarText = `${balances.length} balances retrieved and loading into Binance`
      this.snackbarModel = true
      this.loadBinanceBalances(balances)
      this.loading = false
    },
    loadBinanceBalances (balances) {
      const balancesMap = {}
      for (const balance of balances) {
        balancesMap[balance.asset] = balance
      }
      const repos = this.Repositorys.query().with('coins')
      const binance = repos.where('name', 'Binance').first()

      for (const coin of binance?.coins || []) {
        const balance = balancesMap[coin.symbol]
        Coin.update({
          where: coin.id,
          data: { quantity: balance ? balance.free + balance.locked : 0 }
        })
      }
    },
    formatAmount (value) {
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
    coinSum (symbol) {
      const coins = this.Coins.query().where('symbol',
        value => value === symbol
      ).get()
      return coins.reduce(
        (total, coin) => total + coin.quantity,
        0
      )
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
      // Fetch & Store coin prices from Coin Market Cap
      this.loading = 'white'
      const response = await fetch(this.priceFetcherUrl)
      const result = await response.json()
      if (result.error) {
        const e = result.error
        this.snackbarText = `Error: ${e.message}, ${e.text}`
      } else {
        const { quotes: { data } } = result
        for (const coin of Object.values(data)) {
          this.$store.commit('setPriceUSD', { symbol: coin.symbol, price: coin.quote.USD?.price })
        }
        const notThese = coinMarketCapUnlisted.filter(coin => this.coins.includes(coin))
        const exceptions = notThese.length ? `(except ${notThese})` : ''
        this.snackbarText = `Loaded prices ${exceptions}`
      }
      this.snackbarModel = true
      this.loading = false
    },
    portfolioTotalUSD () {
      return (this.coins.reduce(
        (total, symbol) => {
          const value = this.coinTotalUSD(symbol) || 0
          return total + value
        },
        0
      ))
    },
    flyCoin (header) {
      this.$store.commit('setFlyoutDrawer', { fly: true, symbol: header.value })
    },
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
