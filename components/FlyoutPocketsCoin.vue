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
        <!-- COINS & VALUE -->
        <div v-if="pocket.id === 1 || pocket.id === 3">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- PRICE -->
        <div v-if="pocket.id === 2">
          <div v-if="!editPrice" class="clickable text-h5 font-weight-heavy white--text" @click="editPrice = true" v-text="pocket.front" />
          <div v-if="editPrice">
            <v-input hide-details class="floor">
              <v-text-field
                v-model="customPrice"
                title="Enter the new coin price"
                :rules="[rules.numeric]"
                hide-details
                clearable
                outlined
                @blur="updatePrice"
              />
            </v-input>
          </div>
          <div class="sub-title font-weight-light" v-text="pocket.back" />
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
  ** DATA
  */
  data: () => ({
    customPrice: 0,
    editPrice: false,
    rules: {
      numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
    },
  }),

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

  /*
  ** MOUNTED
  */
  mounted () { // This should be watch, not mounted, update when coin changes
    console.log('mounted', this.customPrice)
    this.customPrice = this.coinPriceAmount
  },

  /*
  ** METHODS
  */
  methods: {
    updatePrice () {
      console.log('update', this.customPrice)
      this.$store.commit('setCoinPrice', { symbol: this.symbol, price: this.customPrice })
      this.editPrice = false
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
