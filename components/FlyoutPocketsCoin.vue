<template>
  <v-expansion-panels multiple accordion hover v-model="coinPockets">
    <v-expansion-panel v-for="pocket in pockets" :key="pocket.name">
      <v-expansion-panel-header :color="pocket.color">
        <template v-slot:default="{ open }">
          {{ pocket.name }}
          <v-fade-transition>
            <span v-if="!open">
              <v-chip
                v-if="['Coins', 'Price', 'Value'].includes(pocket.name)"
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
        <div v-if="pocket.name === 'Coins' || pocket.name === 'Value'">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- PRICE -->
        <div v-if="pocket.name === 'Price'">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- Transactions -->
        <div v-if="pocket.name === 'Transactions'">
          <v-list dense two-line class="pa-0">
            <v-list-item v-for="tran in trans" :key="tran.id" class="px-0" :title="tran.note">
              <v-list-item-content class="pa-0">
                <v-list-item-title>
                  <span v-text="tran.repo.name.substring(0, 2)" class="text-h5" />
                  {{ formatAmount(tran.quantity) }}
                  <v-icon>mdi-cash</v-icon>
                  {{ formatAmount(tran.balance) }}
                </v-list-item-title>
                <v-list-item-subtitle v-text="tran.date" />
              </v-list-item-content>
            </v-list-item>
            <v-subheader class="px-0">{{ trans.length }} transactions</v-subheader>
          </v-list>
        </div>

        <!-- HISTORY -->
        <pocket-history v-if="pocket.name === 'History'" :symbol="symbol" />

        <!-- CONVERT -->
        <pocket-convert v-if="pocket.name.startsWith('Convert')" :symbol="symbol" />

        <!-- REPOS -->
        <pocket-repos v-if="pocket.name === 'Repositories'" :coin="coin" :symbol="symbol" />
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
        { name: 'Coins', color: 'primary', front: this.coinSumFormat, back: this.coinSumAmount },
        { name: 'Price', color: 'accent', front: this.coinPriceCurrency, back: this.coinPriceAmount },
        { name: 'Value', color: 'secondary', front: this.coinValueCurrency, back: this.coinValueAmount },
        { name: 'Transactions', color: 'green darken-3', front: null, back: null },
        { name: 'History', color: 'accent', front: null, back: null },
        { name: `Convert ${this.symbol}`, color: 'brown darken-4', front: null, back: null },
        { name: 'Repositories', color: 'black', front: null, back: null },
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
    trans () {
      return this.$store.getters.coinTransactions(this.coin?.id)
    },
  },

  /*
  ** METHODS
  */
  methods: {
    formatAmount (value) {
      return formatAmount(value)
    },
    formatCurrency (value) {
      return formatCurrency(value)
    },
  },

}

</script>
