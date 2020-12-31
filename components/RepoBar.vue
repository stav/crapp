<template>
  <v-app-bar color="indigo">
    <v-icon class="mr-2">mdi-bitcoin</v-icon>
    <v-btn @click="loadRepositorys" color="primary"> Repositories </v-btn>
    <v-spacer />
    {{ symbols.length }} coins in {{ repositorys.length }} repos
    <v-spacer />
    <v-card class="indigo darken-1 mx-auto" :loading="loading">
      <v-card-actions v-if="repositorys.length">
        <v-btn small @click="getBinanceAccountsData"> Binance </v-btn>
        <v-btn small @click="getCoinbaseAccountsData"> Coinbase </v-btn>
        <v-btn small @click="getCoinbaseProAccountsData"> Coinbase Pro </v-btn>
      </v-card-actions>
    </v-card>
    <v-spacer />
    <v-switch
      v-model="zeroCoins"
      class="ml-3 mr-2"
      hide-details
      title="Show coins that we have zero of?"
    />
    <span @click="zeroCoins=true" class="clickable text--secondary"> Zeros </span>
    <v-spacer />
    <span @click="coinValue=false" class="clickable text--secondary"> amount </span>
    <v-switch
      v-model="coinValue"
      class="ml-3 mr-2"
      hide-details
      title="Display amount of coins held or the USD valuation"
    />
    <span @click="coinValue=true" class="clickable text--secondary"> value </span>
    <v-progress-linear absolute bottom indeterminate :active="active" />
  </v-app-bar>
</template>

<script>
export default {

  /*
  ** PROPS
  */
  props: {
    symbols: {
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
    active: false,
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
    zeroCoins: {
      get () {
        return this.$store.state.repoZeroCoins
      },
      set (value) {
        this.$store.commit('setRepoZeroCoins', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {
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
      this.active = false
      this.loading = false
    },
    loadRepositorys () {
      this.active = true
      this.$store.dispatch('loadRepositorys', { force: true, done: this.done })
      this.getCoinbaseProAccountsData()
      this.getCoinbaseAccountsData()
      this.getBinanceAccountsData()
      this.fetchPrices()
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
