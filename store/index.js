import VuexORM from '@vuex-orm/core'
import database from '@/database'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  symbolMapPrice: {},
})

export const getters = {
  coinPrice: (state) => (asset) => {
    const symbol = asset.toUpperCase() + 'USDC'
    const price = state.symbolMapPrice[symbol]
    return price
  },
}

export const mutations = {
  setPricesMap (state, _) {
    state.symbolMapPrice = _
  },
  setPrice (state, { symbol, price }) {
    state.symbolMapPrice[symbol] = parseFloat(price)
  },
}
