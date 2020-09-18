import VuexORM from '@vuex-orm/core'
import database from '@/database'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  symbolMapPrice: { usd: {} },
  flyoutDrawer: false,
  flyoutCoin: null,
})

export const getters = {
  coinPriceUSD: state => symbol => state.symbolMapPrice.usd[symbol],
}

export const mutations = {
  setPriceUSD (state, { symbol, price }) {
    state.symbolMapPrice.usd[symbol] = parseFloat(price)
  },
  setFlyoutDrawer (state, { fly, symbol }) {
    state.flyoutDrawer = fly
    if (symbol) {
      state.flyoutCoin = symbol
    }
  },
}
