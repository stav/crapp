<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6">
      {{ coin }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list>
        <v-list-item class="primary">
          <v-list-item-content>
            <v-list-item-subtitle class="text--disabled"> Coins </v-list-item-subtitle>
            <v-list-item-title v-text="coinSumFormat" class="text-h5" />
            <v-list-item-subtitle v-text="coinSumAmount" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="accent">
          <v-list-item-content>
            <v-list-item-subtitle class="text--disabled"> Price </v-list-item-subtitle>
            <v-list-item-title v-text="coinPriceCurrency" class="text-h5" />
            <v-list-item-subtitle v-text="coinPriceAmount" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="secondary">
          <v-list-item-content>
            <v-list-item-subtitle class="text--disabled"> Value </v-list-item-subtitle>
            <v-list-item-title v-text="coinValueCurrency" class="text-h5" />
            <v-list-item-subtitle v-text="coinValueAmount" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {

  computed: {
    coin () {
      return this.$store.state.flyoutCoin
    },
    coinSumAmount () {
      return this.$store.getters.coinSum(this.coin)
    },
    coinSumFormat () {
      return this.formatAmount(this.coinSumAmount)
    },

    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.coin)
    },
    coinPriceCurrency () {
      return this.formatCurrency(this.coinPriceAmount)
    },

    coinValueAmount () {
      return this.coinSumAmount * this.coinPriceAmount
    },
    coinValueCurrency () {
      return this.formatCurrency(this.coinValueAmount)
    },
  },

  methods: {
    formatAmount (value) {
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
  },

}
</script>
