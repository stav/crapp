<template>
  <v-expansion-panel>
    <!-- HEADER -->
    <v-expansion-panel-header color="blue-grey darken-2">
      {{ symbol }}
      <coin-logo :quantity="coinSumFormat" />
    </v-expansion-panel-header>

    <v-expansion-panel-content color="blue-grey darken-2">
      <!-- NAME -->
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="10"><h3 v-text="coin.name" /></v-col>
          <v-col cols="2">
            <v-btn icon exact nuxt router to="/history" title="Show chart page for this coin">
              <v-icon> mdi-chart-areaspline </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- POCKETS -->
      <coin-pockets />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatAmount } from '@/utils'
import coinPockets from '~/components/FlyoutCoinPockets.vue'
import coinLogo from '~/components/CoinLogo.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'coin-pockets': coinPockets,
    'coin-logo': coinLogo,
  },

  /*
  ** COMPUTED
  */
  computed: {
    coin () {
      return this.$store.state.flyoutCoin || {}
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
  },

}
</script>
