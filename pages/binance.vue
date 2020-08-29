<template>
  <v-layout>
    <v-card :loading="loading" class="mx-auto">
      <v-app-bar>
        <v-img
          :src="require('@/assets/logos-download.com/Binance_logo_coin.png')"
          max-width="27px"
        />
        <v-toolbar-title class="mx-2"> Binance </v-toolbar-title>
        <v-spacer />
        <v-btn title="Clear" @click="clear"> X </v-btn>
        <v-btn @click="() => fetch('system.status')" color="secondary" title="Check the system status"> Status </v-btn>
        <v-btn @click="() => fetch('time')" color="secondary" title="Query server time"> Time </v-btn>
        <v-btn @click="() => fetch('deposit.history')" color="secondary" title="Fetch user deposit history"> History </v-btn>
        <v-btn @click="() => fetchAccount()" color="primary" title="Fetch account information"> Account </v-btn>
        <v-btn @click="() => fetchCoins()" color="primary" title="Fetch information about user coins"> Coins </v-btn>
      </v-app-bar>
      <v-container>
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
                  <v-card-subtitle class="mx-0 px-0" v-text="balance.free" />
                  <v-card-title class="headline mx-0 pl-1" v-text="balance.asset" />
                  <v-card-subtitle
                    class="mx-0 pa-0"
                    v-if="balance.locked"
                    v-text="`${balance.locked} locked`"
                  />
                  <v-card-subtitle class="ma-0 pa-0" v-text="balance.currency" />
                </v-btn>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" v-show="coins.length">
            <v-data-table
              dense
              :headers="headers"
              :search="search"
              :items="coins"
              item-key="coin"
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
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    append-icon="mdi-close"
                    @click:append="search=''"
                    label="Search"
                    single-line
                    hide-details
                  />
                </v-toolbar>
              </template>
              <template v-slot:expanded-item="{ item }">
                <td :colspan="headers.length">
                  <ul>
                    <li v-for="(network, i) in item.networkList" :key="i">
                      {{ network.network }}
                      {{ network.name }}
                      (withdraw:{{ network.withdrawEnable }}, fee:{{ parseFloat(network.withdrawFee) }})
                      {{ network.depositDesc }}
                      {{ network.specialTips }}
                    </li>
                  </ul>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
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
  </v-layout>
</template>

<script>
import { JSONView } from 'vue-json-component'

async function getJson (resource) {
  const response = await fetch('/api/binance/' + resource)
  const result = (response.status === 200 ? await response.json() : { status: response.status })
  const _ = Array.from(result)
  const __ = _.length === 0 ? result : _.length === 1 ? _[0] : _
  return __._ || __
}

export default {

  components: { 'json-view': JSONView },
  fetchOnServer: true,

  async fetch () {
    const { prices } = await getJson('prices')
    for (const _ of prices) {
      this.symbolMapPrice[_.symbol] = parseFloat(_.price)
    }
    this.$store.commit('setPricesMap', this.symbolMapPrice)
  },

  data () {
    return {
      coins: [],
      result: null,
      balances: null,
      search: '',
      heading: '',
      loading: false,
      symbolMapPrice: {},
      headers: [
        { text: 'Coin', value: 'coin', filterable: true },
        { text: 'Name', value: 'name', filterable: true },
        { text: 'Free', value: 'free', filterable: false },
        { text: 'Locked', value: 'locked', filterable: false },
        { text: 'Networks', value: 'networks', filterable: false },
      ],
    }
  },

  computed: {
  },

  methods: {
    clear () {
      this.coins = []
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
    async fetchPrice (balance) {
      this.loading = true
      this.result = await getJson('price/' + balance.asset)
      const _ = this.result.data
      const price = parseFloat(_.price)
      // Update local data
      this.symbolMapPrice[_.symbol] = price
      // Update store
      this.$store.commit('setPrice', _.symbol, price)
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
      this.coins = coins.map(coin => Object.assign({}, coin, { networks: coin.networkList.map(net => net.network) }))
      this.result = { coins: coins.length }
      this.loading = false
    },
  },
}
</script>

<style>
.v-data-table tr {
  cursor: pointer;
}
</style>
