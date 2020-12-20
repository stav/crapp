import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import theme from '@amcharts/amcharts4/themes/dark'

am4core.useTheme(theme)

export default function (chartdiv) {
  // const keyboard = am4core.keyboard
  // const interaction = am4core.getInteraction()
  // const div = interaction.getInteraction(this.$refs.chartdiv)
  // div.events.onAll((ev) => {
  //   console.log('div:', ev)
  // })
  // console.log('interaction:', div)

  const chart = am4core.create(chartdiv, am4charts.XYChart)
  chart.legend = new am4charts.Legend()
  chart.paddingRight = 20
  // chart.plotContainer.tooltipPosition = 'pointer'
  // chart.plotContainer.tooltipText = 'qwer'
  // chart.plotContainer.adapter.add('tooltipText', function(text, target, key) {
  //   console.log('axis', dateAxis.tooltipDate)
  //   // console.log('plot', chart.yAxes.getIndex(0))
  //   return 'texxt'
  // })
  // chart.events.onAll((ev) => {
  //   console.log('chart event:', ev)
  // })

  const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
  dateAxis.renderer.grid.template.location = 0
  dateAxis.tooltipDateFormat = 'yyyy-MM-dd (h)'
  // The following does the same thing as tooltipDateFormat
  // dateAxis.adapter.add('getTooltipText', function(_text, target, _key) {
  //   const d = target.tooltipDate
  //   const Y = d.getFullYear()
  //   const M = d.getMonth()
  //   const D = d.getDate()
  //   const h = d.getHours()
  //   return `${Y}-${M}-${D} ${h}`
  // })

  // const percentValueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  // percentValueAxis.title.text = 'Percent Change'
  // percentValueAxis.renderer.labels.template.adapter.add('text', text => `${text} %`)

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.title.text = 'Price (USD)'
  valueAxis.extraTooltipPrecision = 1
  valueAxis.renderer.minWidth = 35

  const priceSeries = chart.series.push(new am4charts.LineSeries())
  priceSeries.name = 'Price'
  priceSeries.tooltipText = '$ {valueY.value}'
  priceSeries.dataFields.dateX = 'date'
  priceSeries.dataFields.valueY = 'value'
  priceSeries.tooltip.label.adapter.add('text', (text, target) => target.dataItem?.valueY === 0 ? '' : text) // Don't show tooltip for zero-price data

  const percentSeries = chart.series.push(new am4charts.StepLineSeries())
  percentSeries.name = 'Change'
  percentSeries.hidden = true
  percentSeries.dataFields.dateX = 'date'
  percentSeries.dataFields.valueY = 'value'
  percentSeries.dataFields.valueYShow = 'changePercent'
  percentSeries.tooltipText = '{valueY.changePercent}%'

  const scrollbarX = new am4charts.XYChartScrollbar()
  scrollbarX.series.push(priceSeries)
  chart.scrollbarX = scrollbarX

  const unitsAxis = chart.yAxes.push(new am4charts.ValueAxis())
  unitsAxis.title.text = 'Units'
  unitsAxis.renderer.opposite = true

  const unitsSeries = chart.series.push(new am4charts.ColumnSeries())
  unitsSeries.name = 'Units'
  unitsSeries.hidden = true
  unitsSeries.yAxis = unitsAxis
  unitsSeries.extraTooltipPrecision = 1
  unitsSeries.dataFields.dateX = 'date'
  unitsSeries.dataFields.valueY = 'units'
  unitsSeries.stroke = am4core.color('#CDA2AB')
  unitsSeries.strokeWidth = 4
  unitsSeries.columns.template.showTooltipOn = 'always'
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

  const cursor = new am4charts.XYCursor()
  cursor.behavior = 'zoomX'
  cursor.tabindex = 1
  // The following is used if we change: cursor.behavior = 'selectX'
  // cursor.events.on('selectended', function(ev) {
  //   const range = ev.target.xRange
  //   const dateAxis = ev.target.chart.xAxes.getIndex(0)
  //   const from = dateAxis.toAxisPosition(range.start)
  //   const to = dateAxis.toAxisPosition(range.end)
  //   // const from = dateAxis.getPositionLabel(dateAxis.toAxisPosition(range.start))
  //   // const to = dateAxis.getPositionLabel(dateAxis.toAxisPosition(range.end))
  //   console.log('Selected from ' + from + ' to ' + to)
  // })
  chart.cursor = cursor
  return chart
}
