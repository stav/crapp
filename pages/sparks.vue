<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        v-for="symbol of symbols" :key="symbol"
        @click="() => spark(symbol)"
      >
        <v-card class="ma-1" max-width="400">
          <v-sheet :color="color(symbol)" width="400">
            <span v-text="symbol" class="ml-2" />
            <v-sparkline :value="values[symbol]" line-width="1" color="white" />
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  /*
  ** FETCH
  */
  fetch () {
    this.$store.dispatch('loadRepositorys')
  },

  /*
  ** DATA
  */
  data: () => ({
    interval: '240',
    values: {}, // { ADA: [200, 675, 410, 390, 310, 460, 250, 240] }
    colors: {},
  }),

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** symbols
    **
    ** [ "BTC", "ETH", "LINK", … ]
    */
    symbols () {
      return this.$store.getters.sortedUniqueSymbols // .splice(0, 10)
    },
  },

  methods: {
    async series (symbol) {
      const series = this.$store.getters.getKrakenHistorySeries
      const result = await series(symbol, this.interval)
      if (typeof result === 'string') { // error
        this.$store.commit('snackMessage', result)
        const color = {}
        color[symbol] = 'accent'
        this.colors = Object.assign({}, this.colors, color)
        return []
      }
      return result
    },
    async spark (symbol) {
      const data = await this.series(symbol)
      console.log('spark', symbol, data)
      if (data.length) {
        const value = {}
        value[symbol] = data
        this.values = Object.assign({}, this.values, value)
      }
    },
    color (symbol) {
      return this.colors[symbol] || 'cyan darken-4'
    },
  },

}
</script>

<style>
  .v-sheet :hover {
    cursor: pointer;
  }
</style>
