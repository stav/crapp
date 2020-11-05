import VuexORM from '@vuex-orm/core'
import database, { loadBinanceBalances, loadCoinbaseAccounts, loadCoinbaseProAccounts } from '@/database'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

const coinPanelIndex = 0
const repoPanelIndex = 1

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'USD'],
  navDrawer: null,
  flyoutDrawer: null,
  flyoutPanels: [],
  flyoutCoin: null,
  flyoutRepoId: null,
  sparks: {},
  sparkPair: {},
  selectedRepos: [],
})

export const getters = {
  coinPriceUSD: () => (symbol) => {
    return Coin.query().where('symbol', symbol).first()?.price
  },
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
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
  sparkLines: state => symbol => state.sparks[symbol || state.flyoutCoin?.symbol] || [],
  sparkPair: state => () => state.sparkPair[state.flyoutCoin?.symbol] || '',
}

export const actions = {
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
  async loadKraken (context, { symbol, done }) {
    await loadKrakenSparks(context, symbol)

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

export const mutations = {
  setSelectedRepos (state, repos) {
    state.selectedRepos = repos
  },
  setNavDrawer (state, fly) {
    state.navDrawer = fly
  },
  setFlyoutDrawer (state, fly) {
    state.flyoutDrawer = fly
  },
  toggleFlyout (state) {
    state.flyoutDrawer = !state.flyoutDrawer
  },
  openRepoFlyout (state) {
    if (!state.flyoutPanels.includes(repoPanelIndex)) {
      state.flyoutPanels.push(repoPanelIndex)
    }
  },
  openCoinFlyout (state) {
    if (!state.flyoutPanels.includes(coinPanelIndex)) {
      state.flyoutPanels.push(coinPanelIndex)
    }
  },
  closeCoinFlyout (state) {
    if (state.flyoutPanels.includes(coinPanelIndex)) {
      state.flyoutPanels.pop(coinPanelIndex)
    }
  },
  setFlyoutPanels (state, value) {
    state.flyoutPanels = value
  },
  setFlyoutCoin (state, { symbol }) {
    state.flyoutCoin = Coin.query().where('symbol', symbol).first()
  },
  setFlyoutRepo (state, repo) {
    state.flyoutRepoId = repo.id
  },
  setSparks (state, { symbol, data }) {
    symbol = symbol || state.flyoutCoin.symbol
    const sparks = {}
    sparks[symbol] = data
    state.sparks = Object.assign({ ...state.sparks }, sparks)
  },
  setSparkPair (state, { symbol, pair }) {
    symbol = symbol || state.flyoutCoin.symbol
    const sparkPair = {}
    sparkPair[symbol] = pair
    state.sparkPair = Object.assign({ ...state.sparkPair }, sparkPair)
  },
}
