import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Coin from '~/models/Coin'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD'],
  symbolMapPrice: { usd: {} },
  flyoutDrawer: false,
  flyoutCoin: null,
})

export const getters = {
  coinPriceUSD: state => symbol => state.symbolMapPrice.usd[symbol],
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
  coinSum: state => symbol => {
    console.log('store getters', Coin)
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
  setFlyoutDrawer (state, { fly, symbol }) {
    state.flyoutDrawer = fly
    if (symbol) {
      state.flyoutCoin = symbol
    }
  },
}
