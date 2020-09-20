import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Coin from '~/models/Coin'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD'],
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

export const mutations = {
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
