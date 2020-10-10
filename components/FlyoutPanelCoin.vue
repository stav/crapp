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
        <v-list-item>
          <v-list-item-content>
            <v-input>
              <v-text-field
                v-model="convert"
                :label="`Convert ${coin}`"
                :rules="[rules.numeric]"
                placeholder="1.5"
                hide-details
                clearable
                outlined
                dense
              />
            </v-input>
            {{ convertedUSD }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'

export default {

  data () {
    return {
      convert: null,
      rules: {
        numeric: n => !isNaN(parseFloat(n)) && isFinite(n),
      },
    }
  },

  computed: {
    coin () {
      return this.$store.state.flyoutCoin
    },
    coinSumAmount () {
      return this.$store.getters.coinSum(this.coin)
    },
    coinSumFormat () {
      return formatAmount(this.coinSumAmount)
    },

    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.coin)
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
      return formatCurrency(this.convert * this.coinPriceAmount)
    }
  },

}
</script>
