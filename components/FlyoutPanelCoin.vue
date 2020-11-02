<template>
  <v-expansion-panel>
    <v-expansion-panel-header v-text="symbol" class="text-h6" color="blue-grey darken-2" />
    <v-expansion-panel-content color="blue-grey darken-2">
      <h3 v-text="name" />
      <v-card class="mx-auto">
        <v-card-text class="primary">
          <div class="sub-title font-weight-light"> Coins </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinSumFormat" />
          <div class="sub-title font-weight-light" v-text="coinSumAmount" />
        </v-card-text>

        <v-card-text class="accent">
          <div class="sub-title font-weight-light"> Price </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinPriceCurrency" />
          <div class="sub-title font-weight-light" v-text="coinPriceAmount" />
        </v-card-text>

        <v-card-text class="secondary">
          <div class="sub-title font-weight-light"> Value </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinValueCurrency" />
          <div class="sub-title font-weight-light" v-text="coinValueAmount" />
        </v-card-text>
      </v-card>

      <v-card :loading="loading" class="mx-auto mt-4">
        <v-progress-linear :active="loading" color="primary" indeterminate />

        <v-sheet class="ma-3 mt-6" v-show="pair"> {{ pair }}</v-sheet>

        <v-sparkline
          :value="sparks"
          color="white"
          line-width="2"
          padding="16"
        />

        <v-card-actions>
          <v-btn small fab @click="clearHistory" :disabled="!symbol || !pair">
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <v-btn @click="getKrakenData" :disabled="!symbol"> History </v-btn>
        </v-card-actions>
      </v-card>

      <v-input hide-details class="mt-4">
        <v-text-field
          v-model="convert"
          :label="`Convert ${symbol}`"
          :rules="[rules.numeric]"
          placeholder="1.5"
          hide-details
          clearable
          outlined
          dense
        />
      </v-input>
      <div class="ml-4 mt-2" v-show="convert" v-text="convertedUSD" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'

export default {

  data () {
    return {
      loading: false,
      convert: null,
      rules: {
        numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
      },
    }
  },

  computed: {
    coin () {
      return this.$store.state.flyoutCoin
    },
    name () {
      return this.coin?.name
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
    sparks () {
      return this.$store.getters.sparkLines()
    },
    pair () {
      return this.$store.getters.sparkPair()
    },

  },

  methods: {
    getKrakenData () {
      this.loading = true
      this.$store.dispatch('loadKrakenFly', this.done)
    },
    done () {
      this.loading = false
    },
    clearHistory () {
      this.loading = false
      this.$store.commit('setSparks', { data: [] })
      this.$store.commit('setSparkPair', { pair: '' })
    },
  },

}
</script>
