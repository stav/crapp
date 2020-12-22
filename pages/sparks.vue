<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-btn @click="bitfinex" color="primary"> Bitfinex </v-btn>
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

  /*
  ** METHODS
  */
  methods: {

    color (symbol) {
      return this.colors[symbol] || 'accent'
    },

    disabled (symbol) {
      return this.disableds[symbol]
    },

    async series (symbol) {
      const result = await this.priceHistory(symbol, this.interval)
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

    /*
    ** priceHistory
    **
    ** [ [ MTS, OPEN, CLOSE, HIGH, LOW, VOLUME ],... ]
    **
    ** result == {
    **   "candles": [
    **     [ 1608604200000, 22806, 22806, 22806, 22806, 0.005 ],
    **     [ 1608604140000, 22805, 22805, 22819.195206, 22802, 0.9808448 ],
    **     [ 1608604080000, 22830, 22805.657248, 22830, 22797, 1.16280923 ]
    ** ] }
    */
    async priceHistory (symbol) {
      const response = await fetch('/api/bitfinex/candles?symbol=' + symbol)
      const result = await response.json()

      if (result.error) {
        const e = result.error
        const message = `Error: ${e.message}, ${e.text}`
        console.error(message)
        return message
      }
      const { candles } = result
      if (candles.length === 0) {
        return `No history pricing for ${symbol}`
      }
      return candles.map(candle => candle[2])
    },

    async bitfinex () {
      for (const symbol of this.symbols) {
        await this.spark(symbol)
      }
    },

  },

}
</script>

<style>
  .v-sheet :hover {
    cursor: pointer;
  }
</style>
