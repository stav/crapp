import VuexORM from '@vuex-orm/core'
import database, { loadBinanceBalances, loadCoinbaseAccounts, loadCoinbaseProAccounts } from '@/database'
import RepoCoin from '~/models/RepoCoin'
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
    return Coin.query().where('symbol', symbol).first()?.price
  },
  coinSum: () => (symbol) => {
    return RepoCoin
      .query()
      .with('coin') // Somehow this doesn't work...
      .where((repocoin) => {
        const coin = Coin.find(repocoin.coinId) // ...so we need to do this
        return coin.symbol === symbol
      })
      .get()
      .reduce((total, coin) => total + coin.quantity, 0)
  },
  coinsUnListed: state => () => state.coinMarketCapUnlisted,
}

export const actions = {
  async loadBinanceBalances (context, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    loadBinanceBalances(balances)
    if (done) {
      done(`${balances.length} balances retrieved and loading into Binance`)
    }
  },
  async loadCoinbaseAccounts (context, done) {
    const response = await fetch('/api/coinbase/v2/accounts')
    let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.balance.amount))
    loadCoinbaseAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase`)
    }
  },
  async loadCoinbaseProAccounts (context, done) {
    const response = await fetch('/api/coinbasepro/accounts')
    let accounts = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold))
    loadCoinbaseProAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase Pro`)
    }
  },
  setPriceUSD (context, { symbol, price }) {
    Coin.insertOrUpdate({
      data: {
        id: Coin.query().where('symbol', symbol).first()?.id,
        symbol,
        price,
      }
    })
  },
}

export const mutations = {
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
