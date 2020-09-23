import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Repository from '~/models/Repository'
import Price from '~/models/Price'
import Coin from '~/models/Coin'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'USD'],
  flyoutDrawer: null,
  flyoutCoin: null,
  flyoutRepoId: null,
})

export const getters = {
  coinPriceUSD: () => (symbol) => {
    const price = Price.query().where('symbol', symbol).first()
    return price?.price
  },
  coinSum: () => (symbol) => {
    const coins = Coin.query().where('symbol',
      value => value === symbol
    ).get()
    return coins.reduce(
      (total, coin) => total + coin.quantity,
      0
    )
  },
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
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
      const price = Price.query().where('symbol', coin?.symbol).first()
      Coin.insertOrUpdate({
        data: {
          id: coin?.id,
          name: coin?.name || balance.asset,
          symbol: balance.asset,
          quantity: parseFloat(balance.free || 0) + parseFloat(balance.locked || 0),
          repoId: binance.id,
          priceId: price?.id,
        }
      })
    }
  },
  setPriceUSD (state, { symbol, price }) {
    Price.insertOrUpdate({
      data: {
        id: Price.query().where('symbol', symbol).first()?.id,
        symbol,
        price,
      }
    })
  },
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
}
