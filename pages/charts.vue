<template>
  <v-card class="mx-auto">
    <v-app-bar color="green darken-4">
      <v-icon class="mr-2">mdi-chart-areaspline</v-icon> History <v-spacer />
      <v-radio-group dense row mandatory v-model="interval" :hide-details="true">
        <v-radio label="1" value="1" />
        <v-radio label="5" value="5" />
        <v-radio label="15" value="15" />
        <v-radio label="30" value="30" />
        <v-radio label="60" value="60" />
        <v-radio label="240" value="240" />
        <v-radio label="1440" value="1440" />
        <v-radio label="10080" value="10080" />
        <v-radio label="21600" value="21600" />
      </v-radio-group>
      <v-spacer />
      {{ coin }}
    </v-app-bar>
    <div class="history-chart" ref="chartdiv" />
    <v-card-actions>
      <v-btn
        v-for="symbol of symbols" :key="symbol"
        v-text="symbol"
        @click="() => load(symbol)"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import theme from '@amcharts/amcharts4/themes/dark'

am4core.useTheme(theme)

export default {

  /*
  ** DATA
  */
  data () {
    return {
      coin: '',
      interval: '240',
    }
  },

  computed: {
    // coin () {
    //   return this.$store.state.flyoutCoin
    // },
    /*
    ** symbols
    **
    ** [ "BTC", "ETH", "LINK", … ]
    */
    symbols () {
      return this.$store.getters.sortedUniqueSymbols
    },
  },

  mounted () {
    console.log('mounted')
    const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.paddingRight = 20

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.tooltip.disabled = true
    valueAxis.renderer.minWidth = 35

    const series = chart.series.push(new am4charts.LineSeries())
    series.dataFields.dateX = 'date'
    series.dataFields.valueY = 'value'

    series.tooltipText = '{valueY.value}'
    chart.cursor = new am4charts.XYCursor()

    const scrollbarX = new am4charts.XYChartScrollbar()
    scrollbarX.series.push(series)
    chart.scrollbarX = scrollbarX

    this.chart = chart
    this.load()
  },

  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },

  methods: {
    async load (symbol) {
      symbol = symbol || this.$store.state.flyoutCoin?.symbol
      this.chart.data = await this.$store.getters.getKrakenHistorySeries(symbol, this.interval)
      this.coin = symbol
      console.log('load', this.coin)
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.history-chart {
  width: 100%;
  height: 500px;
}
</style>
