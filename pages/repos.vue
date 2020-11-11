<template>
  <v-card class="mx-auto" :loading="loading">
    <repo-bar :repositorys="repositorys" :coins="symbols" />

    <repo-table :repositorys="repositorys" :coins="symbols" />

    <v-snackbar v-model="snackbarModel" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarModel = false"> Close </v-btn>
      </template>
    </v-snackbar>
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
  ** DATA
  */
  data: () => ({
    // timeout: null,
    loading: false,
    snackbarText: '',
    snackbarModel: false,
  }),

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
      return this.$store.getters.sortedUniqueSymbols()
    },
  },

  /*
  ** MOUNTED
  */
  mounted () {
    this.snackbarText = 'Mounted'
    this.snackbarModel = true
    // this.timeout = setInterval(this.getCoinbaseAccountsData, 10000)
  },

  /*
  ** METHODS
  */
  methods: {
    getCoinbaseProAccountsData () {
      this.loading = 'blue'
      this.$store.dispatch('loadCoinbaseProAccounts', this.done)
    },
    getCoinbaseAccountsData () {
      this.loading = 'yellow'
      this.$store.dispatch('loadCoinbaseAccounts', this.done)
    },
    getBinanceAccountsData () {
      this.loading = 'green'
      this.$store.dispatch('loadBinanceBalances', this.done)
    },
    done (message) {
      if (message) {
        this.snackbarText = message
        this.snackbarModel = true
      }
      this.loading = false
    },
  },

  // beforeRouteLeave (to, from, next) {
  //   clearTimeout(this.timeout)
  //   next()
  // },

}
</script>
