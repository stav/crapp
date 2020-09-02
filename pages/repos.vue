<template>
  <v-card class="mx-auto" :loading="loading">
    <v-toolbar color="indigo">
      <v-card-title color="indigo darken-2"> Repositories </v-card-title>
    </v-toolbar>

    <v-data-table :headers="headers" :items="repositorys">
      <template v-slot:no-data> No data </template>
    </v-data-table>

    <v-snackbar v-model="snackbarModel">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarModel = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-card-actions>
      <v-btn @click="getCoinbaseAccountsData" v-if="coinbase"> Coinbase </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Coin from '~/models/Coin'
import Repository from '~/models/Repository'
import repositorys from '~/data/repositorys'

export default {

  async fetch () {
    Repository.create({ data: await repositorys() })
  },

  data: () => ({
    // timeout: null,
    loading: false,
    snackbarModel: false,
    snackbarText: '',
  }),

  computed: {
    repositorys () {
      const _ = this.$store.$db().model('repositorys').query().with('coins').get()
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
    coinbase () {
      const _ = this.$store.$db().model('repositorys').query().get()
      return !!_.length
    }
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
      this.snackbarText = `${accounts.length} accounts retrieved`
      this.snackbarModel = true
      this.loadCoinbaseAccounts(accounts)
      this.loading = false
    },
    loadCoinbaseAccounts (accounts) {
      // TODO: Maybe insertOrUpdate since we may have new coins
      // TODO: Error handling
      for (const account of accounts) {
        const coinbase = Repository.query().where('name', 'Coinbase')
        const record = coinbase.with('coins', (query) => {
          query.where('symbol', account.balance.currency)
        }).first()
        if (record && record.coins.length) {
          const coin = record.coins[0]
          Coin.update({
            where: coin.id,
            data: {
              quantity: parseFloat(account.balance.amount),
            }
          })
        }
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
