<template>
  <v-expansion-panels multiple accordion hover v-model="coinPockets">
    <v-expansion-panel v-for="pocket in pockets" :key="pocket.id">
      <v-expansion-panel-header :color="pocket.color">
        <template v-slot:default="{ open }">
          {{ pocket.name }}
          <v-fade-transition >
            <span v-if="!open">
              <v-chip
                v-if="pocket.id !== 4"
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

        <!-- CONVERT -->
        <div v-if="pocket.id === 4">
          <v-input hide-details>
            <v-text-field
              v-model="convert"
              :rules="[rules.numeric]"
              placeholder="1.5"
              hide-details
              clearable
              outlined
              dense
            />
          </v-input>
          <div class="ml-4 mt-2" v-show="convert" v-text="convertedUSD" />
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'

export default {

  /*
  ** DATA
  */
  data () {
    return {
      convert: null,
      rules: {
        numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
      },
    }
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
        { id: 4, name: `Convert ${this.symbol}`, color: 'green darken-4', front: null, back: null },
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
    convertedUSD () {
      return 'USD ' + formatCurrency(this.convert * this.coinPriceAmount)
    },
  },

}
</script>
