<template>
  <v-expansion-panels multiple accordion hover v-model="coinPockets">
    <v-expansion-panel v-for="pocket in pockets" :key="pocket.id">
      <v-expansion-panel-header :color="pocket.color">
        <template v-slot:default="{ open }">
          {{ pocket.name }}
          <v-fade-transition>
            <span v-if="!open">
              <v-chip
                v-if="[1, 2, 3].includes(pocket.id)"
                x-small pill class="ml-2 px-2"
                :color="pocket.color + ' darken-1'"
              >
                {{ pocket.front }}
              </v-chip>
            </span>
          </v-fade-transition>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content :color="pocket.color">
        <!-- NORMAL -->
        <div v-if="pocket.id !== 4">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div v-if="[1, 2, 3].includes(pocket.id)" class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- HISTORY -->
        <pocket-history v-if="pocket.id === 5" :symbol="symbol" />

        <!-- CONVERT -->
        <pocket-convert v-if="pocket.id === 4" :symbol="symbol" />

        <!-- REPOS -->
        <pocket-repos v-if="pocket.id === 6" :coin="coin" :symbol="symbol" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'
import PocketConvert from './PocketConvert.vue'
import PocketHistory from './PocketHistory.vue'
import PocketRepos from './PocketRepos.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'pocket-convert': PocketConvert,
    'pocket-history': PocketHistory,
    'pocket-repos': PocketRepos,
  },

  /*
  ** COMPUTED
  */
  computed: {
    coinPockets: {
      get () {
        return this.$store.state.coinPockets
      },
      set (value) {
        this.$store.commit('setCoinPockets', value)
      }
    },
    pockets () {
      return [
        { id: 1, name: 'Coins', color: 'primary', front: this.coinSumFormat, back: this.coinSumAmount },
        { id: 2, name: 'Price', color: 'accent', front: this.coinPriceCurrency, back: this.coinPriceAmount },
        { id: 3, name: 'Value', color: 'secondary', front: this.coinValueCurrency, back: this.coinValueAmount },
        { id: 5, name: 'History', color: 'accent', front: null, back: null },
        { id: 4, name: `Convert ${this.symbol}`, color: 'green darken-4', front: null, back: null },
        { id: 6, name: 'Repositories', color: 'blank', front: null, back: null },
      ]
    },
    coin () {
      return this.$store.state.flyoutCoin
    },
    symbol () {
      return this.coin?.symbol
    },
    coinSumAmount () {
      return this.$store.getters.coinSum(this.symbol)
    },
    coinSumFormat () {
      return formatAmount(this.coinSumAmount)
    },
    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.symbol)
    },
    coinPriceCurrency () {
      return formatCurrency(this.coinPriceAmount)
    },
    coinValueAmount () {
      return this.coinSumAmount * this.coinPriceAmount
    },
    coinValueCurrency () {
      return formatCurrency(this.coinValueAmount)
    },
  },

}
</script>
