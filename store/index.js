import VuexORM from '@vuex-orm/core'
import database from '@/database'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  counter: 0,
  binance: {
    symbolMapPrice: {},
  },
})

export const getters = {
  binanceSymbolMapPrice (state) {
    return state.binance.symbolMapPrice
  },
}

// export const actions = {
//   async setPrices({ commit }) {
//     commit('prices')
//   },
// }

export const mutations = {
  increment (state) {
    state.counter++
  },
  setPricesMap (state, _) {
    state.binance.symbolMapPrice = _
  },
  setPrice (state, { symbol, price }) {
    state.binance.symbolMapPrice[symbol] = price
  },
}
