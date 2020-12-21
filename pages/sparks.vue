<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-btn
          v-for="symbol of symbols" :key="symbol"
          @click="() => spark(symbol)"
          v-text="symbol"
          :disabled="disabled(symbol)"
          :color="color(symbol)"
          class="mr-1 mb-1"
        />
      </v-col>
      <v-col cols="10">
        <v-container>
          <v-row no-gutters>
            <v-col
              v-for="symbol in Object.keys(sparks)" :key="symbol"
              @click="() => spark(symbol)"
            >
              <v-card class="ma-1" max-width="400">
                <v-sheet :color="sheetColor" width="400">
                  <span v-text="symbol" class="ml-2" />
                  <v-sparkline :value="sparks[symbol]" line-width="1" color="white" />
                </v-sheet>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const COLOR = 'cyan darken-4'

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
    interval: '60',
    disableds: {},
    sparks: {}, // { ADA: [200, 675, 410, 390, 310, 460, 250, 240] }
    colors: {},
    sheetColor: COLOR,
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
        const disabled = {}
        disabled[symbol] = true
        this.disableds = Object.assign({}, this.disableds, disabled)
        return []
      }
      return result
    },
    async spark (symbol) {
      this.$store.commit('setFlyoutCoin', { symbol })
      this.$store.commit('openCoinFlyout')
      const data = await this.series(symbol)
      console.log('spark', symbol, data)
      if (data.length) {
        const value = {}
        value[symbol] = data
        this.sparks = Object.assign({}, this.sparks, value)
        const color = {}
        color[symbol] = COLOR
        this.colors = Object.assign({}, this.colors, color)
      }
    },
    color (symbol) {
      return this.colors[symbol] || 'accent'
    },
    disabled (symbol) {
      return this.disableds[symbol]
    },
  },

}
</script>

<style>
  .v-sheet :hover {
    cursor: pointer;
  }
</style>
