import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Coin from '~/models/Coin'
import Repository from '~/models/Repository'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'USD'],
  symbolMapPrice: { usd: {} },
  flyoutDrawer: null,
  flyoutCoinDrawer: false,
  flyoutRepoDrawer: false,
  flyoutCoin: null,
  flyoutRepo: null,
})

export const getters = {
  coinPriceUSD: state => symbol => state.symbolMapPrice.usd[symbol],
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
  coinSum: () => (symbol) => {
    const coins = Coin.query().where('symbol',
      value => value === symbol
    ).get()
    return coins.reduce(
      (total, coin) => total + coin.quantity,
      0
    )
  },
}

export const actions = {
  increment (context) {
    context.commit('increment')
  },
  async loadBinanceBalances ({ commit }, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    commit('loadBinanceBalances', balances)
    const message = `${balances.length} balances retrieved and loading into Binance`
    if (done) {
      done(message)
    }
  },
}

export const mutations = {
  loadBinanceBalances (state, balances) {
    const repos = Repository.query().with('coins')
    const binance = repos.where('name', 'Binance').first()

    for (const balance of balances) {
      const coin = binance.coins.find(coin => coin.symbol === balance.asset)
      Coin.insertOrUpdate({
        data: {
          id: coin?.id,
          name: coin?.name || balance.asset,
          symbol: balance.asset,
          quantity: parseFloat(balance.free || 0) + parseFloat(balance.locked || 0),
          repoId: binance.id,
        }
      })
    }
  },
  setPriceUSD (state, { symbol, price }) {
    state.symbolMapPrice.usd[symbol] = parseFloat(price)
  },
  setFlyoutDrawer (state, drawer) {
    state.flyoutDrawer = drawer
  },
  setFlyoutCoinDrawer (state, { fly, symbol }) {
    state.flyoutCoinDrawer = fly
    if (fly) {
      state.flyoutDrawer = 'setFlyoutCoinDrawer'
    }
    if (symbol) {
      state.flyoutCoin = symbol
    }
  },
  setFlyoutRepoDrawer (state, { fly, repo }) {
    state.flyoutRepoDrawer = fly
    if (fly) {
      state.flyoutDrawer = 'setFlyoutRepoDrawer'
    }
    if (repo) {
      state.flyoutRepo = repo
    }
  },
}
