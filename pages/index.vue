<template>
  <div>
    <h2 class="brown--text text--darken"> CrApp, the crypto app.</h2>
    <v-btn exact nuxt router to="/repos" @click.native="getThingsGoing">
      Click me
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    async getThingsGoing () {
      this.$store.dispatch('getThingsGoing')
      await this.$store.dispatch('loadRepositorys', { force: true })
      await Promise.all([
        this.$store.dispatch('loadBinanceBalances'),
        this.$store.dispatch('loadCoinbaseAmateurAccounts'),
        this.$store.dispatch('loadCoinbaseProAccounts'),
      ])
      this.$store.dispatch('fetchPrices', this.done)
      this.$store.dispatch('fetchCoins', this.done)
    },
  },
}
</script>
