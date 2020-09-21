import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Coin from '~/models/Coin'
import Repository from '~/models/Repository'

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

export const actions = {
  increment (context) {
    context.commit('increment')
  },
  async loadBinanceBalances ({ commit }, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    commit('loadBinanceBalances', balances );
    const message = `${balances.length} balances retrieved and loading into Binance`
    done(message)
  },
}

export const mutations = {
  loadBinanceBalances (state, balances) {
    const balancesMap = {}
    for (const balance of balances) {
        balancesMap[balance.asset] = balance
      }
      const repos = Repository.query().with('coins')
      const binance = repos.where('name', 'Binance').first()
      
      for (const coin of binance?.coins || []) {
          const balance = balancesMap[coin.symbol]
          Coin.update({
              where: coin.id,
              data: { quantity: balance ? balance.free + balance.locked : 0 }
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
