<template>
  <v-layout>
    <v-card :loading="loading" class="mx-auto">
      <v-app-bar>
        <v-img
          :src="require('@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png')"
          max-width="27px"
        />
        <v-toolbar-title class="mx-2">
          Coinbase
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          title="Clear"
          @click="clear"
        >
          X
        </v-btn>
        <v-btn
          title="Go get the accounts data (coins)"
          color="success"
          @click="getAccountsData"
        >
          Accounts
        </v-btn>
      </v-app-bar>
      <v-container>
        <v-row dense>
          <v-col cols="12" v-show="wallets.length">
            Accounts
          </v-col>
          <v-col cols="12" v-show="wallets.length===0">
            Press the green button
          </v-col>
          <v-col cols="12" v-show="wallets.length">
            <json-view :data="accounts" />
          </v-col>
          <v-col
            v-for="(wallet, i) in wallets"
            :key="i"
          >
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-btn x-large block :color="wallet.primary ? 'primary' : ''"
                  @click="() => getAccountData(wallet.resource_path, wallet.balance.currency, wallet.native_balance.currency)"
                >
                  <v-card-subtitle
                    class="mx-0 px-0"
                    v-text="wallet.balance.amount"
                  />
                  <v-card-title
                    class="headline mx-0 pl-1"
                    v-text="wallet.balance.currency"
                  />
                  <v-card-title
                    class="mx-0 pr-1"
                    v-text="wallet.native_balance.currency"
                  />
                  <v-card-subtitle
                    class="mx-0 pa-0"
                    v-text="wallet.native_balance.amount"
                  />
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="account.data">
            {{account.data.name}}
            <json-view :data="account" class="pt-0" />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="buy.data">
            BUY Price: 1 {{buy.data.base}} = {{buy.data.amount}} {{buy.data.currency}}
            <json-view :data="buy" class="pt-0" />
          </v-col>
          <v-col v-if="spot.data">
            SPOT Price: 1 {{spot.data.base}} = {{spot.data.amount}} {{spot.data.currency}}
            <json-view :data="spot" class="pt-0" />
          </v-col>
          <v-col v-if="sell.data">
            SELL Price: 1 {{sell.data.base}} = {{sell.data.amount}} {{sell.data.currency}}
            <json-view :data="sell" class="pt-0" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script>
import crypto from 'crypto'
import { JSONView } from 'vue-json-component'

export default {

  components: { 'json-view': JSONView },

  data () {
    return {
      buy: {},
      spot: {},
      sell: {},
      account: {},
      accounts: {},
      loading: false,
    }
  },

  computed: {
    wallets () {
      console.log(this.accounts)
      if (
        this.accounts &&
        this.accounts.data
      ) {
        return this.accounts.data.filter(wallet => parseFloat(wallet.balance.amount))
      } else {
        return []
      }
    }
  },

  methods: {
    clear () {
      this.buy = {}
      this.spot = {}
      this.sell = {}
      this.account = {}
      this.accounts = {}
    },
    async getAccountData (resource_path, coin_currency, native_currency) {
      console.log('resource_path', resource_path)
      this.loading = true

      let response = await fetch('/api/coinbase' + resource_path)
      this.account = response.status === 200 ? await response.json() : {status: response.status}

      const currency_pair = `${coin_currency}-${native_currency}`

      response = await fetch(`api/coinbase/v2/prices/${currency_pair}/buy`)
      this.buy = response.status === 200 ? await response.json() : {status: response.status}
      response = await fetch(`api/coinbase/v2/prices/${currency_pair}/spot`)
      this.spot = response.status === 200 ? await response.json() : {status: response.status}
      response = await fetch(`api/coinbase/v2/prices/${currency_pair}/sell`)
      this.sell = response.status === 200 ? await response.json() : {status: response.status}

      this.loading = false
    },
    async getAccountsData () {
      this.loading = true
      const response = await fetch('/api/coinbase/v2/accounts')
      this.accounts = response.status === 200 ? await response.json() : {status: response.status}
      this.loading = false
    },
  },
}
</script>
