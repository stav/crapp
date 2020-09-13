<template>
  <v-card class="mx-auto" :loading="loading">
    <v-toolbar color="indigo">
      <v-card-title color="indigo darken-2"> Repositories </v-card-title>
    </v-toolbar>

    <v-data-table :headers="headers" :items="repositorys" hide-default-footer>
      <template v-slot:body.append v-if="repositorys.length">
        <tr class="primary">
          <td v-for="header of headers" :key="header.value">
            <span v-if="header.value === 'name'"> Total </span>
            <span
              v-if="header.coin"
              v-text="formatAmount(coinSum(header.value))"
              :title="coinSum(header.value)"
            />
          </td>
        </tr>
        <tr class="accent">
          <td v-for="header of headers" :key="header.value">
            <span v-if="header.value === 'name'"> Price </span>
            <span
              v-if="header.coin"
              v-text="`$${formatAmount(coinPriceNew(header.value))}`"
              :title="coinPriceNew(header.value)"
            />
          </td>
        </tr>
        <tr class="secondary">
          <td v-for="header of headers" :key="header.value">
            <span v-if="header.value === 'name'"> Value </span>
            <span v-if="header.coin" v-text="coinTotalUSD(header.value)"></span>
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
      <v-btn @click="getCoinbaseAccountsData"> Coinbase </v-btn>
      <v-btn @click="getBinanceAccountsData"> Binance </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Coin from '~/models/Coin'
import Repository from '~/models/Repository'
import repositorys from '~/data/repositorys'

export default {

  fetchOnServer: true,

  async fetch () {
    // Create Repository database
    // TODO: only create if empty?
    Repository.create({ data: await repositorys() })

    // Fetch & Store coin prices from Coin Market Cap
    const response = await fetch('/api/coinmarketcap/quotes?symbol=' + this.coins.join(','))
    const result = (response.status === 200 ? await response.json() : { status: response.status })
    const { quotes: { data } } = result
    for (const coin of Object.values(data)) {
      this.$store.commit('setPriceUSD', { symbol: coin.symbol, price: coin.quote.USD?.price })
    }
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
        { text: '', value: 'name' },
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
  },

  mounted () {
    this.snackbarText = 'Mounted'
    this.snackbarModel = true
    // this.timeout = setInterval(this.getCoinbaseAccountsData, 10000)
  },

  methods: {
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
      // TODO: Maybe insertOrUpdate since we may have new coins
      // TODO: Error handling
      const accounts_map = {}
      for (const account of accounts) {
        accounts_map[account.currency] = account
      }
      const repos = this.Repositorys.query().with('coins')
      const coinbase = repos.where('name', 'Coinbase').first()

      for (const coin of coinbase.coins) {
        const account = accounts_map[coin.symbol]
        Coin.update({
          where: coin.id,
          data: { quantity: account ? parseFloat(account.balance.amount) : 0 }
        })
      }
    },
    async getBinanceAccountsData () {
      this.loading = 'green'
      const response = await fetch('/api/binance/balances')
      let { balances } = response.status === 200 ? await response.json() : { status: response.status }
      this.snackbarText = `${balances.length} balances retrieved and loading into Binance`
      this.snackbarModel = true
      this.loadBinanceBalances(balances)
      this.loading = false
    },
    loadBinanceBalances (balances) {
      const balances_map = {}
      for (const balance of balances) {
        balances_map[balance.asset] = balance
      }
      const repos = this.Repositorys.query().with('coins')
      const binance = repos.where('name', 'Binance').first()

      for (const coin of binance.coins) {
        const balance = balances_map[coin.symbol]
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
        (value) => value === symbol
      ).get()
      return coins.reduce(
        (total, coin) => total + coin.quantity,
        0
      )
    },
    coinPriceNew (symbol) {
      return this.$store.getters.coinPriceUSD(symbol)
    },
    coinTotalUSD (symbol) {
      const amount = this.coinSum(symbol)
      const price = this.coinPriceNew(symbol)
      return price ? this.formatCurrency(amount * price) : ''
    },
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
