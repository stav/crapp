<template>
  <v-card class="mx-auto">
    <v-list dense class="px-1">
      <v-list-item
        v-for="repo in repos" :key="repo.id"
        @click="() => flyRepository(repo)"
        :title="repo.name"
        class="pa-1"
      >
        <v-list-item-icon class="mr-6">
          <coin-logo :quantity="coinSumForRepoFormat(repo)" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="repo.name" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
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
    coin: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** repos
    **
    ** Returns an Array of repositories that cointain at least one flyout coin
    */
    repos () {
      return this.$store.getters.repositorys
        .filter(repo => repo.coins.filter(coin => coin.symbol === this.coin.symbol).length)
        .sort((a, b) => this.coinSumForRepo(b) - this.coinSumForRepo(a))
    },
  },

  /*
  ** METHODS
  */
  methods: {
    flyRepository (repo) {
      this.$store.dispatch('flyRepository', repo)
    },
    coinSumForRepo (repo) {
      return repo.coins
        .filter(coin => coin.symbol === this.coin.symbol)
        .reduce((total, coin) => total + coin.quantity, 0)
    },
    coinSumForRepoFormat (repo) {
      return formatAmount(this.coinSumForRepo(repo))
    },
  },

}
</script>
