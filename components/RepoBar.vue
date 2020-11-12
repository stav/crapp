<template>
  <v-app-bar color="indigo">
    <v-icon class="mr-2">mdi-bitcoin</v-icon> Repositories <v-spacer />
    {{ coins.length }} coins in {{ repositorys.length }} repos <v-spacer />
    <v-card class="indigo darken-1 mx-auto" :loading="loading">
      <v-card-actions v-if="repositorys.length">
        <v-btn
          @click="fetchAllSparks"
          title="Press to fetch latest history prices displayed as sparklines"
          small class="accent"
        >
          Sparks
        </v-btn>
        <v-btn
          @click="fetchPrices"
          title="Press to fetch latest current prices"
          small class="accent"
        >
          Prices
        </v-btn>
        <v-btn small @click="getBinanceAccountsData"> Binance </v-btn>
        <v-btn small @click="getCoinbaseAccountsData"> Coinbase </v-btn>
        <v-btn small @click="getCoinbaseProAccountsData"> Coinbase Pro </v-btn>
      </v-card-actions>
    </v-card>
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
</template>

<script>
export default {

  /*
  ** PROPS
  */
  props: {
    coins: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    repositorys: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  /*
  ** DATA
  */
  data: () => ({
    loading: false,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    coinValue: {
      get () {
        return this.$store.state.repoCoinValue
      },
      set (value) {
        this.$store.commit('setRepoCoinValue', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {
    fetchAllSparks () {
      this.loading = 'white'
      this.$store.dispatch('loadKraken', { symbols: this.coins, done: this.done })
    },
    fetchPrices () {
      this.loading = 'accent'
      this.$store.dispatch('fetchPrices', this.done)
    },
    getCoinbaseProAccountsData () {
      this.loading = 'blue'
      this.$store.dispatch('loadCoinbaseProAccounts', this.done)
    },
    getCoinbaseAccountsData () {
      this.loading = 'green'
      this.$store.dispatch('loadCoinbaseAccounts', this.done)
    },
    getBinanceAccountsData () {
      this.loading = 'yellow'
      this.$store.dispatch('loadBinanceBalances', this.done)
    },
    done (message) {
      if (message) {
        this.$store.commit('snackMessage', message)
      }
      this.loading = false
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
