<template>
  <v-expansion-panel>
    <!-- HEADER -->
    <v-expansion-panel-header class="text-h6">
      <span
        class="d-inline-block text-truncate"
        style="width: 120px"
        v-text="repository.name"
      />
      <v-chip x-small pill class="px-2" color="accent">{{ sumCoins }}</v-chip>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <!-- NAME -->
      <div class="pb-2 text--disabled" v-text="repository.name" />

      <!-- POCKETS -->
      <repo-pockets :repository="repository" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatCurrency } from '@/utils'
import repoPockets from '~/components/FlyoutPocketsRepo.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'repo-pockets': repoPockets,
  },

  /*
  ** COMPUTED
  */
  computed: {
    repository () {
      return this.$store.getters.flyoutRepo
    },
    sumCoins () {
      const coins = this.repository.coins || []
      const total = coins.reduce(
        (total, coin) => total + coin.quantity * this.$store.getters.coinPriceUSD(coin.symbol),
        0 // Initialize sum at zero
      )
      return formatCurrency(total)
    },
  },

}
</script>
