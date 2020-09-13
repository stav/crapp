import VuexORM from '@vuex-orm/core'
import database from '@/database'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  symbolMapPrice: { usd: {} },
})

export const getters = {
  coinPriceUSD: (state) => (symbol) => state.symbolMapPrice.usd[symbol],
}

export const mutations = {
  setPriceUSD (state, { symbol, price }) {
    state.symbolMapPrice.usd[symbol] = parseFloat(price)
  },
}
