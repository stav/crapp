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
import Transaction from '~/models/Transaction'

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
    const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.paddingRight = 20
    chart.cursor = new am4charts.XYCursor()
    chart.legend = new am4charts.Legend()

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0
    dateAxis.tooltipDateFormat = 'yyyy-MM-dd'

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text = 'Price (USD)'
    valueAxis.extraTooltipPrecision = 1
    valueAxis.renderer.minWidth = 35

    const priceSeries = chart.series.push(new am4charts.LineSeries())
    priceSeries.name = 'Price History'
    priceSeries.tooltipText = '$ {valueY.value}'
    priceSeries.dataFields.dateX = 'date'
    priceSeries.dataFields.valueY = 'value'

    const scrollbarX = new am4charts.XYChartScrollbar()
    scrollbarX.series.push(priceSeries)
    chart.scrollbarX = scrollbarX

    const unitsAxis = chart.yAxes.push(new am4charts.ValueAxis())
    unitsAxis.title.text = 'Units'
    unitsAxis.renderer.opposite = true

    const unitsSeries = chart.series.push(new am4charts.ColumnSeries())
    unitsSeries.name = 'Units'
    unitsSeries.yAxis = unitsAxis
    unitsSeries.extraTooltipPrecision = 1
    unitsSeries.dataFields.dateX = 'date'
    unitsSeries.dataFields.valueY = 'units'
    unitsSeries.stroke = am4core.color('#CDA2AB')
    unitsSeries.strokeWidth = 4
    unitsSeries.columns.template.showTooltipOn = 'hit'
    unitsSeries.columns.template.propertyFields.fill = 'color'
    unitsSeries.columns.template.propertyFields.stroke = 'white'
    unitsSeries.columns.template.tooltipText = '{type} on {repo}:\n[bold]{quantity}[/]'
    // unitsSeries.columns.template.width = am4core.percent(1000)
    unitsSeries.columns.template.width = 32

    chart.maskBullets = false
    const labelBullet = unitsSeries.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.text = '{valueY}'
    labelBullet.label.truncate = false
    labelBullet.label.hideOversized = false
    labelBullet.label.horizontalCenter = 'left'
    labelBullet.label.dx = 18
    // labelBullet.adapter.add('y', () => 15)

    this.chart = chart
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

    async loadInterval () {
      function sort (a, b) {
        if (a.timestamp > b.timestamp) { return 1 }
        if (a.timestamp < b.timestamp) { return -1 }
        return 0
      }
      function addTransactions () {
        // const coin = Coin.query().where('symbol', this.symbol).first()
        let t = 0
        for (let d = 0; d < data.length; d++) {
          const { date: chartDate } = data[d]
          const chartTimestamp = chartDate.getTime()
          const transTimestamp = trans[t].timestamp
          if (transTimestamp < chartTimestamp) {
            data[d].units = trans[t].quantity
            data[d].type = trans[t].type
            data[d].repo = trans[t].repo
            data[d].quantity = trans[t].quantity
            data[d].color = trans[t].quantity > 0 ? 'green' : 'red'
            if (++t >= trans.length) { break }
            // data.splice(d, 0, { date: new Date(transTimestamp), units: Math.abs(value) })
          }
        }
      }
      this.$store.dispatch('flyCoin', this.symbol)
      const series = this.$store.getters.getKrakenHistorySeries
      const data = await series(this.symbol, this.interval)
      const trans = Transaction.query().where('symbol', this.symbol).get().sort(sort)
      if (trans.length) { addTransactions() }
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
