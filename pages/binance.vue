<template>
  <v-card :loading="loading" class="mx-auto">
    <v-app-bar>
      <v-img class="image-icon" :src="binanceImageIcon" />
      <v-toolbar-title class="mx-2"> Binance </v-toolbar-title>
      <v-spacer />
      <v-btn title="Clear" @click="clear"> X </v-btn>
      <v-btn @click="() => fetch('system.status')" color="secondary" title="Check the system status"> Status </v-btn>
      <v-btn @click="() => fetch('time')" color="secondary" title="Query server time"> Time </v-btn>
      <v-btn @click="() => fetch('deposit.history')" color="secondary" title="Fetch user deposit history"> History </v-btn>
      <v-btn @click="() => fetchAccount()" color="primary" title="Fetch account information"> Account </v-btn>
      <v-btn @click="() => fetchCoins()" color="primary" title="Fetch information about user coins"> Coins </v-btn>
      <v-btn @click="() => fetchTrades()" color="primary" title="Fetch information about user trades"> Trades </v-btn>
    </v-app-bar>
    <v-container>
      <!-- DISPLAY COMPONENTS -->
      <v-row dense>
        <v-col cols="12" v-show="heading" v-text="heading" />
        <v-col v-for="balance in balances" :key="balance.asset">
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-btn
                x-large block
                :title="'Press to fetch the current price for ' + balance.asset"
                @click="() => fetchPrice(balance)"
              >
                <v-card-subtitle class="mx-0 px-0" v-text="formatAmount(balance.free)" title="free" />
                <v-card-title class="headline mx-0 pl-1" v-text="balance.asset" />
                <v-card-subtitle
                  title="locked"
                  class="mx-0 pa-0"
                  v-if="balance.locked"
                  v-text="formatAmount(balance.locked)"
                />
                <v-card-subtitle class="ma-0 pa-0" v-text="balance.currency" />
              </v-btn>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" v-show="coins.length">
          <v-data-table
            dense
            :headers="headersCoins"
            :search="searchCoins"
            :items="coins"
            item-key="coin"
            item-class="classesc"
            multi-sort
            :sort-by="['free', 'locked']"
            :sort-desc="[true, false]"
            @click:row="detailRow"
            show-expand
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> Coins </v-toolbar-title>
                <v-spacer />
                <v-text-field
                  v-model="searchCoins"
                  prepend-icon="mdi-magnify"
                  append-icon="mdi-close"
                  @click:append="searchCoins=''"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-toolbar>
            </template>
            <template v-slot:expanded-item="{ item }">
              <td :colspan="headersCoins.length">
                <ul class="pa-0">
                  <li v-for="(network, i) in item.networkList" :key="i">
                    {{ network.network }}
                    {{ network.name }}
                    (withdraw:{{ network.withdrawEnable }}, fee:{{ parseFloat(network.withdrawFee) }})
                    {{ network.depositDesc }}
                    {{ network.specialTips }}
                  </li>
                </ul>
                <p class="ma-4">
                  {{ item }}
                </p>
              </td>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="12" v-show="trades.length">
          <v-data-table
            dense
            :headers="headersTrades"
            :search="searchTrades"
            :items="trades"
            item-key="id"
            item-class="classest"
            :items-per-page="-1"
            sort-by="time"
            :sort-desc="true"
            show-expand
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> Trades </v-toolbar-title>
                <v-spacer />
                <v-text-field
                  v-model="searchTrades"
                  prepend-icon="mdi-magnify"
                  append-icon="mdi-close"
                  @click:append="searchTrades=''"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-toolbar>
            </template>
            <template v-slot:item.time="{ item }">
              {{ new Date(item.time) }}
            </template>
            <template v-slot:item.qty="{ item }">
              {{ formatAmount(item.qty) }}
            </template>
            <template v-slot:item.price="{ item }">
              {{ formatAmount(item.price) }}
            </template>
            <template v-slot:expanded-item="{ item }">
              <td :colspan="headersTrades.length">
                {{ item }}
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <!-- JSON DATA -->
      <v-row>
        <v-col>
          <json-view :data="result" root-key="result" v-show="result" />
        </v-col>
        <v-col>
          <json-view :data="balances" root-key="balances" v-show="balances" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import qs from 'qs'
import { JSONView } from 'vue-json-component'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'
import { formatAmount } from '@/utils'

async function getJson (resource, params = {}) {
  const querystring = qs.stringify(params)
  const url = `/api/binance/${resource}?${querystring}`
  const response = await fetch(url)
  const result = (response.status === 200 ? await response.json() : { status: response.status })
  const _ = Array.from(result)
  const __ = _.length === 0 ? result : _.length === 1 ? _[0] : _
  return __._ || __
}

async function postData(resource = '', data = {}) {
  const url = `/api/binance/${resource}`
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'content-type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

export default {

  components: { 'json-view': JSONView },

  /*
  ** DATA
  */
  data: () => ({
    coins: [],
    result: null,
    balances: null,
    searchCoins: '',
    searchTrades: '',
    heading: '',
    loading: false,
    symbolMapPrice: {},
    binanceImageIcon,
    headersCoins: [
      { text: 'Coin', value: 'coin', filterable: true },
      { text: 'Name', value: 'name', filterable: true },
      { text: 'Free', value: 'free', filterable: false },
      { text: 'Locked', value: 'locked', filterable: false },
      { text: 'Networks', value: 'networks', filterable: false },
    ],
    headersTrades: [
      { text: 'Time', value: 'time', filterable: false },
      { text: 'Pair', value: 'pair', filterable: true, align: 'center' },
      { text: 'Order#', value: 'order', filterable: false, align: 'center' },
      { text: 'Quantity', value: 'qty', filterable: false, align: 'end' },
      { text: 'Price', value: 'price', filterable: false, align: 'end' },
      { text: 'Buyer', value: 'isBuyer', filterable: false, align: 'center' },
      { text: 'Maker', value: 'isMaker', filterable: false, align: 'center' },
    ],
  }),

  /*
  ** COMPUTED
  */
  computed: {
    trades: {
      get () {
        return this.$store.state.binanceTrades
      },
      set (value) {
        this.$store.commit('setBinanceTrades', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {
    clear () {
      this.coins = []
      this.trades = []
      this.result = null
      this.balances = null
      this.heading = ''
    },
    detailRow (item) {
      this.result = item
    },
    currency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
    formatAmount (value) {
      return formatAmount(value, 6)
    },
    async fetchPrice (balance) {
      this.loading = true
      this.result = await getJson('price', { asset: balance.asset })
      const _ = this.result.data
      const price = parseFloat(_.price)
      // Update local data
      this.symbolMapPrice[_.symbol] = price
      // // Update store
      // this.$store.commit('setPrice', _.symbol, price)
      // Update display balances
      const amount = price * (balance.free + balance.locked)
      const _balance = this.balances[balance.asset]
      _balance.currency = this.currency(amount)
      _balance.amount = amount
      _balance.price = price
      this.balances = Object.assign({}, this.balances) // Make reactive
      this.loading = false
    },
    async fetch (resource) {
      this.loading = true
      this.clear()
      this.heading = resource
      this.result = await getJson(resource)
      this.loading = false
    },
    async fetchAccount () {
      this.loading = true
      this.clear()
      this.heading = 'Account'
      this.result = await getJson('account')
      this.balances = {}
      for (const balance of this.result.account.balances) {
        const free = parseFloat(balance.free)
        const locked = parseFloat(balance.locked)

        if (free || locked) {
          balance.free = free
          balance.locked = locked
          const symbol = balance.asset + 'USDT'
          const amount = this.symbolMapPrice[symbol] * (free + locked)
          balance.currency = this.currency(amount)
          this.balances[balance.asset] = balance
        }
      }
      this.result.account.balances = this.result.account.balances.length // too much data
      this.loading = false
    },
    async fetchCoins () {
      this.loading = true
      this.clear()
      const coins = await getJson('coins')
      this.coins = coins.map(coin =>
        Object.assign(
          {},
          coin,
          { classesc: 'clickable-row' },
          { networks: coin.networkList.map(net => net.network) }
        )
      )
      this.result = { coins: coins.length }
      this.loading = false
    },
    async fetchTrades () {
      this.loading = true
      if (this.$store.getters.repositorys.length === 0) {
        console.info('Loading repositories')
        await this.$store.dispatch('loadRepositorys')
      }
      const repo = this.$store.getters.repositoryFromSlug('binance')
      const pairs = repo?.pairs // .slice(0, 4)
      const trades = await postData('trades', { pairs })
      console.log('fetchTrades', trades)
      const _trades = []
      for (const trade of trades) {
        const classes = { classest: trade.isBuyer ? 'green darken-4' : 'red darken-4' }
        const _trade = Object.assign({}, trade, classes)
        console.log('trade', _trade)
        _trades.push(_trade)
      }
      this.trades = _trades
      this.loading = false
    },
  },
}
</script>

<style lang="scss">
.clickable-row {
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.image-icon {
  max-width: 27px;
  max-height: 27px;
}
</style>
