import { loadBinanceBalances, loadCoinbaseAccounts, loadCoinbaseProAccounts } from '@/database'
import Coin from '~/models/Coin'

export default {
  async loadBinanceBalances (_context, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    loadBinanceBalances(balances)
    if (done) {
      done(`${balances.length} balances retrieved and loading into Binance`)
    }
  },
  async loadCoinbaseAccounts (_context, done) {
    const response = await fetch('/api/coinbase/v2/accounts')
    let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.balance.amount))
    loadCoinbaseAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase`)
    }
  },
  async loadCoinbaseProAccounts (_context, done) {
    const response = await fetch('/api/coinbasepro/accounts')
    let accounts = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold))
    loadCoinbaseProAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase Pro`)
    }
  },
  /*
  ** loadKraken
  **
  ** {
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
  async loadKraken (context, { symbols, done }) {
    for (const symbol of symbols) {
      await loadKrakenSparks(context, symbol)
    }
    if (done) {
      done(`${typeof json} from Kraken`)
    }
  },
  async loadKrakenFly (context, done) {
    await loadKrakenSparks(context, context.state.flyoutCoin.symbol)

    if (done) {
      done(`${typeof data} from Kraken`)
    }
  },
  setCoin (_context, coin) {
    Coin.insertOrUpdate({
      data: {
        id: Coin.query().where('symbol', coin.symbol).first()?.id,
        ...coin,
      }
    })
  },
  async fetchPrices (context, done) {
    await fetchPrices(context)
    done && done()
  },
}

async function loadKrakenSparks (context, symbol) {
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

/*
** fetchPrices
**
** Fetch current market prices for all coins in all repositories
**
** result = {
**   quotes: {
**     data: { BTC:{…}, ETH:{…}, … },
**     status: {…}
**   }
** }
**
** data = {
**   BTC: Object { id: 1, name: "Bitcoin", symbol: "BTC", … },
**   ETH: Object { id: 1027, name: "Ethereum", symbol: "ETH", … },
**   {…}
** }
**
** coinData = {
**   id: 1,
**   symbol: "BTC",
**   name: "Bitcoin",
**   slug: "bitcoin",
**   quote: { USD: { price: 13814.127956929022, … } },…
** }
**
** coin =
**   { symbol: "BTC", price: 13814.127956929022 }
**
** unlisted = [ "CGLD", "USD" ]
**
** coinsUnlisted = [ "USD" ]
*/
async function fetchPrices (context) {
  const symbols = context.getters.sortedUniqueSymbols
  const coinsUnListed = context.getters.coinsUnListed
  const coinsListed = symbols.filter(coin => !coinsUnListed.includes(coin))
  const priceFetcherPath = '/api/coinmarketcap/quotes?symbol='
  const priceFetcherUrl = priceFetcherPath + coinsListed.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()

  if (result.error) {
    const e = result.error
    console.error(`Error: ${e.message}, ${e.text}`)
  } else {
    const { quotes: { data } } = result
    for (const coinData of Object.values(data)) {
      context.dispatch('setCoin', {
        symbol: coinData.symbol,
        price: coinData.quote.USD?.price,
        name: coinData.name,
        slug: coinData.slug,
      })
    }
    if (symbols.includes('USD')) {
      context.dispatch('setCoin', { symbol: 'USD', price: 1 })
    }
    const unlisted = context.getters.coinsUnListed
    const coinsUnListed = symbols.filter(coin => unlisted.includes(coin))
    const exceptions = coinsUnListed.length ? `(except ${coinsUnListed})` : ''
    console.debug(`Loaded prices ${exceptions}`)
  }
}
