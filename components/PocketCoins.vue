<template>
  <v-card class="mx-auto">
    <v-card-text class="accent px-0">
      <v-list dense v-if="coins" class="px-1">
        <v-list-item
          v-for="coin of coins" :key="coin.id"
          @click="() => flyCoin(coin.symbol)"
          class="px-0 pb-4 accent"
          :title="`${name(coin)} (${coin.symbol})`"
        >
          <v-list-item-icon class="mr-4">
            <coin-logo :symbol="coin.symbol" :quantity="formatAmount(coin.quantity)" />
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-list-item-title v-text="name(coin)" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <h3 v-if="!coins"> Select a repository by clicking on it. </h3>
    </v-card-text>
  </v-card>
</template>

<script>
import { formatAmount } from '@/utils'
import coinLogo from '~/components/CoinLogo.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'coin-logo': coinLogo,
  },

  /*
  ** PROPS
  */
  props: {
    coins: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  /*
  ** METHODS
  */
  methods: {
    formatAmount (value) {
      return formatAmount(value)
    },
    flyCoin (symbol) {
      this.$store.dispatch('flyCoin', symbol)
    },
    name (repoCoin) {
      const coin = this.$store.state.Coin.find(coin => coin.symbol === repoCoin.symbol)
      return coin.name || repoCoin.symbol
    },
  },

}
</script>
