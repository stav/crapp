<template>
  <v-card class="mx-auto">
    <repo-bar :repositorys="repositorys" :symbols="symbols" />
    <repo-table :repositorys="repositorys" :symbols="symbols" />
  </v-card>
</template>

<script lang="ts">
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
    const activeRepos = this.repositorys.filter(_ => _.active)
    this.$store.commit('setSelectedRepos', activeRepos)
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
