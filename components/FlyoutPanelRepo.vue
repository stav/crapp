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

  computed: {
    /*
    ** repository
    **
    ** {
    **   "$id": "$uid22",
    **   "id": "$uid22",
    **   "name": "Coinbase Pro",
    **   "active": true,
    **   "coins": [{
    **     "$id": "$uid74",
    **     "id": "$uid74",
    **     "coinId": "$uid2",
    **     "repoId": "$uid22",
    **     "qtyFree": 0.998093,
    **     "coin": {
    **       "$id": "$uid2",
    **       "id": "$uid2",
    **       "name": "Ethereum",
    **       "slug": "ethereum",
    **       "price": 506.33756,
    **       "symbol": "ETH"
    **     }
    **   }]
    ** }
    */
    repository () {
      return this.$store.getters.flyoutRepo
    },
    sumCoins () {
      const coins = this.repository.coins || []
      const total = coins.reduce(
        (total, coin) => total + coin.qtyFree * coin.coin.price,
        0 // Initialize sum at zero
      )
      return formatCurrency(total)
    },
  },

}
</script>
