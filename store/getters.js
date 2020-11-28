import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

export default {

  /*
  ** repositorys
  **
  ** Database data
  **
  ** Return an array of unvalued repositories
  */
  repositorys () {
    return Repository.query().with(['coins', 'coins.coin']).all()
  },

  /*
  ** coinPriceUSD
  */
  coinPriceUSD: () => (symbol) => {
    return Coin.query().where('symbol', symbol).first()?.price
  },

  /*
  ** coinSum
  */
  coinSum: state => (symbol) => {
    return RepoCoin
      .query()
      .with('coin') // Somehow this doesn't work...
      .where((repocoin) => {
        const coin = Coin.find(repocoin.coinId) // ...so we need to do this
        const selectedRepoIds = state.selectedRepos.map(_ => _.id)
        const included = selectedRepoIds.includes(repocoin.repoId)
        return included && coin.symbol === symbol
      })
      .get()
      .reduce((total, coin) => total + coin.quantity, 0)
  },
  /*
  ** sortedUniqueSymbols
  **
  ** Coin.all() == [{
  **   "id": "$uid1",
  **   "name": "Bitcoin",
  **   "slug": "bitcoin",
  **   "price": 15298,
  **   "symbol": "BTC"
  ** },…]
  **
  ** return [ "BTC", … ]
  */
  sortedUniqueSymbols () {
    const uniqueSymbols = new Set(Coin.all().map(coin => coin.symbol))
    return Array.from(uniqueSymbols).sort()
  },

  /*
  ** coinsUnListed
  */
  coinsUnListed: state => state.coinMarketCapUnlisted,

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
      console.error('Kraken histoy error:', json.history.error)
      return []
    } else {
      const result = json.history.result
      const pair = Object.keys(result)[0]
      const data = result[pair].map(xract)
      return data
    }
  },

}
