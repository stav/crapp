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
    <ranger />
    <v-spacer />
    <span @click="switchAmountValue=false" class="clickable text--secondary"> amount </span>
    <v-switch
      v-model="switchAmountValue"
      class="ml-3 mr-2"
      hide-details
      title="Display amount of coins held or the USD valuation"
    />
    <span @click="switchAmountValue=true" class="clickable text--secondary"> value </span>
    <v-progress-linear absolute bottom indeterminate :active="active" />
  </v-app-bar>
</template>

<script>
import ranger from './Ranger.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    ranger,
  },

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
    switchAmountValue: {
      get () {
        return this.$store.state.switchAmountValue
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
    getCoinbaseProAccountsData () {
      this.loading = 'blue'
      this.$store.dispatch('loadCoinbaseProAccounts', this.done)
    },
    getCoinbaseAccountsData () {
      this.loading = 'green'
      this.$store.dispatch('loadCoinbaseAmateurAccounts', this.done)
    },
    async getBinanceAccountsData () {
      this.loading = 'yellow'
      await this.$store.dispatch('loadBinanceBalances', this.done)
    },
    done (message) {
      if (message) {
        this.$store.commit('snackMessage', message)
      }
      this.active = false
      this.loading = false
    },
    async loadRepositorys () {
      this.active = true
      await this.$store.dispatch('loadRepositorys', { force: true, done: this.done })
      await Promise.all([
        this.$store.dispatch('loadBinanceBalances'),
        this.$store.dispatch('loadCoinbaseAmateurAccounts'),
        this.$store.dispatch('loadCoinbaseProAccounts'),
      ])
      this.$store.dispatch('fetchPrices', this.done)
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
