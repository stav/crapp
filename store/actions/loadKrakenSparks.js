/*
** loadKrakenSparks
**
** json == {
**   history: {
**     error: [],
**     result: {
**       XXBTZUSD: [ // Array(720)
**         [
**           1602648000,    // time
**           "11400.0",     // open
**           "11400.0",     // high
**           "11376.5",     // low
**           "11380.0",     // close
**           "11383.6",     // vwap
**           "38.52231340", // volume
**           82             // count
**         ],…
**       ],
**       last: 1602863400 // id to be used as "since" when polling for new data
**     }
**   }
** }
*/
export default async function loadKrakenSparks (context, symbol) {
  const response = await fetch('/api/kraken/history?symbol=' + symbol)
  const json = response.status === 200 ? await response.json() : { status: response.status }

  if (json.history.error.length) {
    context.commit('setSparkPair', { symbol, pair: json.history.error.toString() })
    context.commit('setSparks', { symbol, data: [] })
  } else {
    const result = json.history.result
    const pair = Object.keys(result)[0]
    const data = result[pair].slice(-10).map(_ => parseFloat(_[5]))
    context.commit('setSparkPair', { symbol, pair })
    context.commit('setSparks', { symbol, data })
  }
}
