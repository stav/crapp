<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6">
      <span
        class="d-inline-block text-truncate"
        style="width: 120px"
        v-text="repository.name"
      />
      <v-chip x-small pill class="px-2" color="accent">{{ sumCoins }}</v-chip>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card class="mx-auto">
        <v-card-text class="accent">
          <v-list v-if="repository.coins" class="pa-0">
            <v-list-item
              v-for="coin of repository.coins"
              :key="coin.id"
              class="pl-0 pb-4 accent"
              @click="() => flyCoin(coin.coin.symbol)"
            >
              <v-list-item-content class="pa-0">
                <v-container class="pa-0">
                  <v-row no-gutters style="flex-wrap: nowrap;">
                    <v-col class="flex-grow-0 flex-shrink-1">
                      <code v-text="coin.coin.symbol" />
                    </v-col>
                    <v-col class="flex-grow-1 flex-shrink-1 align-end pl-2">
                      <v-list-item-subtitle class="text--disabled" v-text="coin.coin.name" />
                    </v-col>
                  </v-row>
                </v-container>
                <v-list-item-title v-text="coin.quantity" class="text-h5" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <h3 v-if="!repository.coins"> Select a repository by clicking on it. </h3>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatCurrency } from '@/utils'

export default {

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
    **     "quantity": 0.998093,
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
      const repoId = this.$store.state.flyoutRepoId
      const model = this.$store.$db().model('repositorys')
      const repos = model.query().with(['coins', 'coins.coin'])
      return repos.find(repoId) || {}
    },
    sumCoins () {
      const coins = this.repository.coins || []
      const total = coins.reduce(
        (total, coin) => total + coin.quantity * coin.coin.price,
        0 // Initialize sum at zero
      )
      return formatCurrency(total)
    },
  },

  methods: {
    flyCoin (symbol) {
      this.$store.dispatch('flyCoin', symbol)
    },
  },

}
</script>
