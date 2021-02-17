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
    <v-input hide-details class="floor">
      <v-text-field
        v-model="floor"
        title="The minimum coin value to display"
        :rules="[rules.numeric]"
        placeholder="1000"
        hide-details
        clearable
        outlined
        dense
      />
    </v-input>
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
    rules: {
      numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
    },
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
    floor: {
      get () {
        return this.$store.state.repoCoinValueFloor
      },
      set (value) {
        this.$store.commit('setRepoCoinValueFloor', value)
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
      // this.getCoinbaseProAccountsData()
      // this.getCoinbaseAccountsData()
      // this.getBinanceAccountsData()
      // this.$store.dispatch('fetchPrices', this.done)
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
.floor {
  max-width: 120px;
}
</style>
