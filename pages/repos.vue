<template>
  <v-card class="mx-auto" :loading="loading">
    <v-toolbar color="indigo">
      <v-card-title color="indigo darken-2"> Repositories </v-card-title>
    </v-toolbar>

    <v-data-table :headers="headers" :items="repositorys">
      <template v-slot:no-data><v-btn @click="$fetch"> Reset </v-btn></template>
    </v-data-table>

    <v-snackbar v-model="snackbarModel" timeout="9000">
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

  async fetch () {
    // TODO: only create if empty?
    Repository.create({ data: await repositorys() })
  },

  data: () => ({
    // timeout: null,
    loading: false,
    snackbarModel: false,
    snackbarText: '',
  }),

  computed: {
    Repositorys () {
      return this.$store.$db().model('repositorys')
    },
    repositorys () {
      const _ = this.Repositorys.query().with('coins').get()
      return _.map((repo) => {
        const coins = {}
        for (const coin of repo.coins) {
          coins[coin.symbol.toLowerCase()] = this.currency(coin.quantity)
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
        _.push({ text: coin, value: coin.toLowerCase() })
      }
      return _
    },
    coins () {
      const coins = this.$store.$db().model('coins').all()
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
    currency (value) {
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
  },

  // beforeRouteLeave (to, from, next) {
  //   console.log('LEAVE', this.timeout)
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
