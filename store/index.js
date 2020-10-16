import VuexORM from '@vuex-orm/core'
import database, { loadBinanceBalances, loadCoinbaseAccounts, loadCoinbaseProAccounts } from '@/database'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'USD'],
  flyoutDrawer: null,
  flyoutCoin: null,
  flyoutRepoId: null,
  sparks: {},
  sparkPair: {},
})

export const getters = {
  coinPriceUSD: () => (symbol) => {
    return Coin.query().where('symbol', symbol).first()?.price
  },
  coinSum: () => (symbol) => {
    return RepoCoin
      .query()
      .with('coin') // Somehow this doesn't work...
      .where((repocoin) => {
        const coin = Coin.find(repocoin.coinId) // ...so we need to do this
        return coin.symbol === symbol
      })
      .get()
      .reduce((total, coin) => total + coin.quantity, 0)
  },
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
  sparkLines: state => () => state.sparks[state.flyoutCoin] || [],
  sparkPair: state => () => state.sparkPair[state.flyoutCoin] || '',
}

export const actions = {
  async loadBinanceBalances (context, done) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    loadBinanceBalances(balances)
    if (done) {
      done(`${balances.length} balances retrieved and loading into Binance`)
    }
  },
  async loadCoinbaseAccounts (context, done) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const response = await fetch('/api/coinbase/v2/accounts')
    let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.balance.amount))
    loadCoinbaseAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase`)
    }
  },
  async loadCoinbaseProAccounts (context, done) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
  async loadKraken (context, done) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const response = await fetch('/api/kraken/history?symbol=' + context.state.flyoutCoin)
    const data = response.status === 200 ? await response.json() : { status: response.status }

    if (data.history.error.length) {
      context.commit('setSparkPair', data.history.error.toString())
    } else {
      const result = data.history.result
      const pair = Object.keys(result)[0]
      context.commit('setSparkPair', pair)
      context.commit('setSparks', result[pair].slice(-10).map(_ => parseFloat(_[5])))
    }

    if (done) {
      done(`${typeof data} from Kraken`)
    }
  },
  setPriceUSD (context, { symbol, price }) { // eslint-disable-line @typescript-eslint/no-unused-vars
    Coin.insertOrUpdate({
      data: {
        id: Coin.query().where('symbol', symbol).first()?.id,
        symbol,
        price,
      }
    })
  },
}

export const mutations = {
  setFlyoutDrawer (state, fly) {
    state.flyoutDrawer = fly
  },
  toggleFlyout (state) {
    state.flyoutDrawer = !state.flyoutDrawer
  },
  setFlyoutCoin (state, { symbol }) {
    state.flyoutCoin = symbol
  },
  setFlyoutRepo (state, repo) {
    state.flyoutRepoId = repo.id
  },
  setSparks (state, data) {
    const sparks = {}
    sparks[state.flyoutCoin] = data
    state.sparks = Object.assign({ ...state.sparks }, sparks)
  },
  setSparkPair (state, pair) {
    const sparkPair = {}
    sparkPair[state.flyoutCoin] = pair
    state.sparkPair = Object.assign({ ...state.sparkPair }, sparkPair)
  },
}
