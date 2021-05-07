import {
  repositorys,
  repositoryFromSlug,
  rangedRepositorys,
  flyoutRepo,
} from './repository'

import {
  coinPriceUSD,
  coinSum,
  symbolsUnlisted,
  sortedUniqueSymbols,
  sortedUniqueRangedSymbols,
} from './coin'

import {
  transactions,
  coinTransactions,
} from './transaction'

export default {

  repositorys,
  rangedRepositorys,
  repositoryFromSlug,
  flyoutRepo,

  coinSum,
  coinPriceUSD,
  symbolsUnlisted,
  sortedUniqueSymbols,
  sortedUniqueRangedSymbols,

  coinTransactions,
  transactions,

  /*
  ** sparkLines
  */
  sparkLines: state => symbol => state.sparks[symbol || state.flyoutCoin?.symbol] || [],

  /*
  ** sparkPair
  */
  sparkPair: state => state.sparkPair[state.flyoutCoin?.symbol] || '',

  /*
  ** getKrakenHistorySeries
  **
  ** json == {
  **   "history": {
  **     "error": [],
  **     "result": {
  **       "XXBTZUSD": [[
  **         1595260800,      // [0] time
  **         "9181.9",        // [1] open
  **         "9208.0",        // [2] high
  **         "9153.9",        // [3] low
  **         "9163.9",        // [4] close
  **         "9179.2",        // [5] vwap
  **         "473.73122415",  // [6] volume
  **         1595             // [7] count
  **       ],… ] } } }
  */
  getKrakenHistorySeries: state => async (symbol, interval) => {
    symbol = symbol || state.flyoutCoin?.symbol
    if (!symbol) { return [] }

    const response = await fetch('/api/kraken/history?symbol=' + symbol + '&interval=' + interval)
    const json = response.status === 200 ? await response.json() : { status: response.status }

    function xract(entry) {
      const date = new Date(parseFloat(entry[0]) * 1000)
      const value = parseFloat(entry[5])
      return { date, value }
    }

    if (json.history.error.length) {
      const unknown = json.history.error.reduce(
        (found, error) => found || error.includes('Unknown asset pair'),
        false
      )
      if (unknown) {
        return `${symbol} not found on Kraken`
      }
      return `Kraken histoy error: ${json.history.error}`
    } else {
      const result = json.history.result
      const pair = Object.keys(result)[0]
      const data = result[pair].map(xract)
      return data
    }
  },

  /*
  ** getTradingViewSymbol
  **
  ** json == {
  **   "history": {
  **     "error": [],
  **     "result": {
  **       "XXBTZUSD": [[
  **         1595260800,      // [0] time
  **         "9181.9",        // [1] open
  **         "9208.0",        // [2] high
  **         "9153.9",        // [3] low
  **         "9163.9",        // [4] close
  **         "9179.2",        // [5] vwap
  **         "473.73122415",  // [6] volume
  **         1595             // [7] count
  **       ],… ] } } }
  */
  getTradingViewSymbol: state => async (symbol) => {
    symbol = symbol || state.flyoutCoin?.symbol
    if (!symbol) { return '' }

    const pair = `${symbol}USD`
    const response = await fetch(`/api/tradingview/search?pair=${pair}`)
    const json = response.status === 200 ? await response.json() : { status: response.status }
    console.log('getTradingViewSymbol', json)
    const result = json.search[0] || {}
    const string = `${result.exchange}:${pair}`
    // state.tradingviewSymbols[symbol] = string
    // this.$store.commit('setTradingviewSymbol', { symbol, string })
    return string
  },

  /*
  ** statements
  */
  statements: state => state.Statement,

}
