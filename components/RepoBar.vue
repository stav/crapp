<template>
  <div>
    <v-app-bar color="indigo">
      <v-icon class="mr-2">mdi-bitcoin</v-icon> Repositories <v-spacer />
      {{ coins.length }} coins in {{ repositorys.length }} repos <v-spacer />
      <v-card class="mx-auto" :loading="loading">
        <v-card-actions v-if="repositorys.length">
          <v-btn
            @click="fetchAllSparks"
            title="Press to fetch latest history prices displayed as sparklines"
            small class="accent px-1"
          >
            Sparks
          </v-btn>
          <v-btn
            @click="fetchPrices"
            title="Press to fetch latest current prices"
            small class="accent px-1"
          >
            Load Coin Data
          </v-btn>
          <v-btn @click="getBinanceAccountsData"> Binance </v-btn>
          <v-btn @click="getCoinbaseAccountsData"> Coinbase </v-btn>
          <v-btn @click="getCoinbaseProAccountsData"> Coinbase Pro </v-btn>
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
    <v-snackbar v-model="snackbarModel" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarModel = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
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
    snackbarText: '',
    snackbarModel: false,
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
      console.debug(message)
      if (message) {
        this.snackbarText = message
        this.snackbarModel = true
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
