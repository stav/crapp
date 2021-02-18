<template>
  <v-card class="mx-auto">
    <v-app-bar color="green darken-4">
      <v-icon class="mr-2">mdi-chart-areaspline</v-icon> History <v-spacer />
      <v-radio-group dense row mandatory v-model="interval" :hide-details="true">
        <v-radio v-for="i in intervals" :key="i" :label="i" :value="i" @click="loadInterval" />
      </v-radio-group>
      <v-spacer />
      {{ symbol }}
    </v-app-bar>
    <div class="history-chart" ref="chartdiv" />
    <v-btn
      v-for="s of symbols" :key="s" v-text="s"
      @click="() => loadSymbol(s)"
    />
  </v-card>
</template>

<script>
import HistoryChart from '@/graphs/history'

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
  data () {
    return {
      symbol: '',
      interval: '240',
      intervals: [ // minutes
        '1',
        '5',
        '15',
        '30',
        '60',
        '240',
        '1440',
        '10080',
        '21600',
      ],
    }
  },

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
      return this.$store.getters.sortedUniqueSymbols
    },
  },

  /*
  ** MOUNTED
  */
  mounted () {
    this.chart = HistoryChart(this.$refs.chartdiv)
    this.loadSymbol()
  },

  /*
  ** BEFORE DESTROY
  */
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },

  /*
  ** METHODS
  */
  methods: {

    async loadSymbol (symbol) {
      this.symbol = symbol || this.$store.state.flyoutCoin?.symbol
      await this.loadInterval()
    },

    // addTransactions (data) {
    //   function sort (a, b) {
    //     if (a.timestamp > b.timestamp) { return 1 }
    //     if (a.timestamp < b.timestamp) { return -1 }
    //     return 0
    //   }
    //   // const coin = Coin.query().where('symbol', this.symbol).first()
    //   const query = Transaction.query().where('symbol', this.symbol)
    //   const trans = query.get().sort(sort)
    //   if (trans.length) {
    //     let t = 0
    //     for (let d = 0; d < data.length; d++) {
    //       const { date: chartDate } = data[d]
    //       const chartTimestamp = chartDate.getTime()
    //       const transTimestamp = trans[t].timestamp
    //       if (transTimestamp < chartTimestamp) {
    //         data[d].units = trans[t].quantity
    //         data[d].type = trans[t].type
    //         data[d].repo = trans[t].repo
    //         data[d].quantity = trans[t].quantity
    //         data[d].color = trans[t].quantity > 0 ? 'green' : 'red'
    //         if (++t >= trans.length) { break }
    //         // data.splice(d, 0, { date: new Date(transTimestamp), units: Math.abs(value) })
    //       }
    //     }
    //   }
    // },

    async series () {
      const series = this.$store.getters.getKrakenHistorySeries
      const result = await series(this.symbol, this.interval)
      if (typeof result === 'string') {
        this.$store.commit('snackMessage', result)
        return []
      }
      return result
    },

    async loadInterval () {
      this.$store.dispatch('flyCoin', this.symbol)
      const data = await this.series()
      // this.addTransactions(data)
      this.chart.data = data
    },

  },

}
</script>

<style scoped>
.history-chart {
  width: 100%;
  height: 500px;
}
</style>
