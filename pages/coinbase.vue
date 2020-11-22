<template>
  <v-card :loading="loading" class="mx-auto">
    <!-- Top bar with green button -->
    <v-app-bar>
      <v-img class="image-icon" :src="coinbaseImageIcon" />
      <v-toolbar-title class="mx-2"> Coinbase </v-toolbar-title>
      <v-spacer />
      <v-btn title="Clear" @click="clear"> X </v-btn>
      <v-btn
        title="Go get the accounts data (coins)"
        color="success"
        @click="getAccountsData"
      >
        Accounts
      </v-btn>
    </v-app-bar>

    <v-container>
      <!-- Individual account buttons with wallet balances -->
      <v-row dense v-show="accounts.length">
        <v-col cols="12"> Accounts </v-col>
        <v-col
          v-for="(account, i) in accounts"
          :key="i"
        >
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-btn
                x-large block :color="account.primary ? 'primary' : ''"
                @click="() => getAccountData(account.resource_path, account.balance.currency, account.native_balance.currency)"
              >
                <v-card-subtitle
                  class="mx-0 px-0"
                  v-text="account.balance.amount"
                />
                <v-card-title
                  class="headline mx-0 pl-1"
                  v-text="account.balance.currency"
                />
                <v-card-title
                  class="mx-0 pr-1"
                  v-text="account.native_balance.currency"
                />
                <v-card-subtitle
                  class="mx-0 pa-0"
                  v-text="account.native_balance.amount"
                />
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Individual accounts response JSON viewer -->
      <v-row v-show="accounts.length">
        <v-col cols="12">
          <json-view :data="accounts" root-key="accounts" />
        </v-col>
      </v-row>

      <!-- Account data -->
      <v-row v-if="currentAccount.data">
        <v-col cols="12">
          {{ currentAccount.data.name }}
          <json-view :data="currentAccount.data" root-key="currentAccount.data" class="pt-0" />
        </v-col>
      </v-row>

      <!-- Price data -->
      <v-row>
        <v-col v-if="buy.data">
          BUY Price: 1 {{ buy.data.base }} = {{ buy.data.amount }} {{ buy.data.currency }}
          <json-view :data="buy" root-key="buy" class="pt-0" />
        </v-col>
        <v-col v-if="spot.data">
          SPOT Price: 1 {{ spot.data.base }} = {{ spot.data.amount }} {{ spot.data.currency }}
          <json-view :data="spot" root-key="spot" class="pt-0" />
        </v-col>
        <v-col v-if="sell.data">
          SELL Price: 1 {{ sell.data.base }} = {{ sell.data.amount }} {{ sell.data.currency }}
          <json-view :data="sell" root-key="sell" class="pt-0" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { JSONView } from 'vue-json-component'
const coinbaseImageIcon = require('@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png')

export default {

  components: { 'json-view': JSONView },

  data () {
    return {
      buy: {},
      spot: {},
      sell: {},
      currentAccount: {},
      accounts: {},
      loading: false,
      coinbaseImageIcon,
    }
  },

  methods: {
    clear () {
      this.buy = {}
      this.spot = {}
      this.sell = {}
      this.currentAccount = {}
      this.accounts = {}
    },
    async getAccountData (resourcePath, coinCurrency, nativeCurrency) {
      this.loading = true

      let response = await fetch('/api/coinbase' + resourcePath)
      this.currentAccount = response.status === 200 ? await response.json() : { status: response.status }

      const currencyPair = `${coinCurrency}-${nativeCurrency}`

      response = await fetch(`api/coinbase/v2/prices/${currencyPair}/buy`)
      this.buy = response.status === 200 ? await response.json() : { status: response.status }

      response = await fetch(`api/coinbase/v2/prices/${currencyPair}/spot`)
      this.spot = response.status === 200 ? await response.json() : { status: response.status }

      response = await fetch(`api/coinbase/v2/prices/${currencyPair}/sell`)
      this.sell = response.status === 200 ? await response.json() : { status: response.status }

      this.loading = false
    },
    async getAccountsData () {
      this.loading = true
      const response = await fetch('/api/coinbase/v2/accounts')
      const { data: accounts } = response.status === 200 ? await response.json() : { data: { status: response.status } }
      this.accounts = accounts.filter(account => parseFloat(account.balance.amount))
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.image-icon {
  max-width: 27px;
  max-height: 27px;
}
</style>
