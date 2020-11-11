<template>
  <v-card class="mx-auto">
    <repo-bar :repositorys="repositorys" :coins="symbols" />
    <repo-table :repositorys="repositorys" :coins="symbols" />
  </v-card>
</template>

<script>
import { loadRepositorys } from '@/database'
import repoTable from '../components/RepoTable.vue'
import repoBar from '../components/RepoBar.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'repo-bar': repoBar,
    'repo-table': repoTable,
  },

  /*
  ** FETCH
  */
  async fetch () {
    await loadRepositorys()
    this.$store.commit('setSelectedRepos', this.repositorys)
    this.$store.dispatch('fetchPrices')
  },

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** repositorys
    **
    ** Database data
    **
    ** Return an array of unvalued repositories
    */
    repositorys () {
      return this.$store.$db()
        .model('repositorys')
        .query()
        .with(['coins', 'coins.coin'])
        .all()
    },
    /*
    ** symbols
    **
    ** [ "BTC", "ETH", "LINK", … ]
    **
    */
    symbols () {
      return this.$store.getters.sortedUniqueSymbols
    },
  },

}
</script>
