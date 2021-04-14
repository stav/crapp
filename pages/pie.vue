<template>
  <v-card class="mx-auto">
    <v-app-bar color="green darken-4">
      <v-icon class="mr-2">mdi-chart-pie</v-icon> I like Pie
      <v-spacer />
      <ranger />
    </v-app-bar>
    <div class="pie-chart" ref="chartdiv" />
  </v-card>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import darkTheme from '@amcharts/amcharts4/themes/dark'
import animatedTheme from '@amcharts/amcharts4/themes/animated'
import ranger from '~/components/Ranger.vue'

am4core.useTheme(animatedTheme)
am4core.useTheme(darkTheme)

export default {

  /*
  ** COMPONENTS
  */
  components: {
    ranger,
  },

  /*
  ** FETCH
  */
  async fetch () {
    await this.$store.dispatch('loadRepositorys')
    this.apply()
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
    /*
    ** filteredSymbols
    **
    ** Only symbols where we have `ranged` coins
    */
    filteredSymbols () {
      return this.symbols.filter(this.filterSymbol)
    },
    /*
    ** data
    **
    ** [ {
    **     "symbol": "ADA",
    **     "amount": 965.6376967236743
    **   },... ]
    */
    data () {
      return this.filteredSymbols.map(symbol => ({
        symbol,
        amount: this.coinValueAmount(symbol),
      }))
    },
    /*
    ** range
    **
    ** The min/max values for coin valuations to display
    **
    ** [ 100, 9000 ]
    */
    range () {
      return this.$store.state.repoCoinValueRange
    },
  },

  /*
  ** WATCH
  */
  watch: {
    range (_newRange, _oldRange) {
      this.apply()
    }
  },

  /*
  ** MOUNTED
  */
  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart3D)

    const pieSeries = chart.series.push(new am4charts.PieSeries3D())
    pieSeries.dataFields.value = 'amount'
    pieSeries.dataFields.category = 'symbol'
    pieSeries.slices.template.stroke = am4core.color('#4a2abb')
    pieSeries.slices.template.strokeWidth = 2
    pieSeries.slices.template.strokeOpacity = 0.5
    pieSeries.slices.template.fillOpacity = 1
    pieSeries.labels.template.text = '{category}: {value.value}'
    const hs = pieSeries.slices.template.states.getKey('hover')
    hs.properties.scale = 1
    hs.properties.fillOpacity = 0.5

    chart.innerRadius = am4core.percent(40)
    chart.legend = new am4charts.Legend()
    chart.data = this.data

    this.chart = chart
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
    coinSumAmount (symbol) {
      return this.$store.getters.coinSum(symbol)
    },
    coinPriceAmount (symbol) {
      return this.$store.getters.coinPriceUSD(symbol)
    },
    coinValueAmount (symbol) {
      return this.coinSumAmount(symbol) * this.coinPriceAmount(symbol)
    },
    apply () {
      this.chart.data = this.data
    },
    filterSymbol (symbol) {
      const amount = this.coinValueAmount(symbol)
      return (this.range[0] < amount) && (amount < this.range[1])
    },
  },

}
</script>

<style scoped>
.pie-chart {
  width: 100%;
  height: 500px;
}
</style>
