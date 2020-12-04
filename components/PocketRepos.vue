<template>
  <v-card class="mx-auto">
    <v-list dense>
      <v-list-item
        v-for="repo in repos" :key="repo.id"
        @click="() => flyRepository(repo)"
        class="pa-0"
      >
        <v-list-item-icon>
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

export default {

  /*
  ** PROPS
  */
  props: {
    coin: {
      type: Object,
      required: true,
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
    ** Returns an Array of repositories that cointain at least one flyout coin.
    ** Furthermore, each repo.coins contains only flyout coins.
    */
    repos () {
      const model = this.$store.$db().model('repositorys')
      const query = model.query().with('coins', (query) => {
        query.where('coinId', this.coin?.id)
      })
      return query
        .has('coins') // this doesnt really work so we'll need to .filter
        .get() // Renders JavaScript Array
        .filter(repo => repo.coins.length) // why doesnt .has do this?
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
      return repo.coins?.reduce((total, coin) => total + coin.quantity, 0)
    },
    coinSumForRepoFormat (repo) {
      return formatAmount(this.coinSumForRepo(repo))
    },
  },

}
</script>
