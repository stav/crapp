import { loadBinanceBalances, loadCoinbaseAccounts, loadCoinbaseProAccounts } from '@/database'
import loadKrakenSparks from './loadKrakenSparks'
import fetchPrices from './fetchPrices'
import Coin from '~/models/Coin'

export default {

  async loadBinanceBalances (_context, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    loadBinanceBalances(balances)
    if (done) {
      done(`${balances.length} balances retrieved and loading into Binance`)
    }
  },

  async loadCoinbaseAccounts (_context, done) {
    const response = await fetch('/api/coinbase/v2/accounts')
    let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.balance.amount))
    loadCoinbaseAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase`)
    }
  },

  async loadCoinbaseProAccounts (_context, done) {
    const response = await fetch('/api/coinbasepro/accounts')
    let accounts = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold))
    loadCoinbaseProAccounts(accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase Pro`)
    }
  },

  async loadKraken (context, { symbols, done }) {
    for (const symbol of symbols) {
      await loadKrakenSparks(context, symbol)
    }
    if (done) {
      done(`${typeof json} from Kraken`)
    }
  },

  async loadKrakenFly (context, done) {
    await loadKrakenSparks(context, context.state.flyoutCoin.symbol)

    if (done) {
      done(`${typeof data} from Kraken`)
    }
  },

  setCoin (_context, coin) {
    Coin.insertOrUpdate({
      data: {
        id: Coin.query().where('symbol', coin.symbol).first()?.id,
        ...coin,
      }
    })
  },

  async fetchPrices (context, done) {
    const message = await fetchPrices(context)
    done && done(message)
  },

  flyRepository (context, repo) {
    context.commit('setFlyoutDrawer', true)
    context.commit('closeCoinFlyout')
    context.commit('openRepoFlyout')
    context.commit('setFlyoutRepo', repo)
  },

}