<template>
  <v-card class="mx-auto">
    <repo-bar :repositorys="repositorys" :symbols="symbols" />
    <repo-table :repositorys="repositorys" :symbols="symbols" />
  </v-card>
</template>

<script>
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
  fetch () {
    this.$store.dispatch('loadRepositorys')
  },

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** repositorys
    **
    ** Return an array of unvalued repositories
    */
    repositorys () {
      return this.$store.getters.repositorys
    },
    /*
    ** symbols
    **
    ** [ "BTC", "ETH", "LINK", … ]
    */
    symbols () {
      return this.$store.getters.sortedUniqueSymbols
    },
  },

}
</script>
