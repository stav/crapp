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
    <v-card-actions>
      <v-btn
        v-for="s of symbols" :key="s"
        @click="() => loadSymbol(s)"
        v-text="s"
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

  mounted () {
    const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.paddingRight = 20
    chart.cursor = new am4charts.XYCursor()

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0
    dateAxis.tooltipDateFormat = 'yyyy-MM-dd'

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text = 'Price (USD)'
    valueAxis.extraTooltipPrecision = 1
    valueAxis.renderer.minWidth = 35

    const series = chart.series.push(new am4charts.LineSeries())
    series.name = 'Price History'
    series.tooltipText = '$ {valueY.value}'
    series.dataFields.dateX = 'date'
    series.dataFields.valueY = 'value'

    series.tooltipText = '{valueY.value}'
    chart.cursor = new am4charts.XYCursor()

    const scrollbarX = new am4charts.XYChartScrollbar()
    scrollbarX.series.push(series)
    chart.scrollbarX = scrollbarX

    this.chart = chart
    this.loadSymbol()
  },

  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },

  methods: {
    async loadSymbol (symbol) {
      this.symbol = symbol || this.$store.state.flyoutCoin?.symbol
      await this.loadInterval()
    },
    async loadInterval () {
      this.$store.dispatch('flyCoin', this.symbol)
      this.chart.data = await this.$store.getters.getKrakenHistorySeries(this.symbol, this.interval)
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
