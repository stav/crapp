import { loadRepositorys } from '@/database'
import loadKrakenSparks from './loadKrakenSparks'
import fetchPrices from './fetchPrices'
import fetchCoins from './fetchCoins'

export default {

  // nuxtServerInit (store, context) {
  //   for (const key in context) {
  //     console.log(key, typeof context[key] == 'object' ? Object.keys(context[key]) : context[key])
  //   }
  // },

  async loadBinanceBalances (context, done) {
    const response = await fetch('/api/binance/balances')
    const { balances } = response.status === 200 ? await response.json() : { status: response.status }
    context.commit('setBinanceBalances', balances)
    if (done) {
      done(`${balances.length} balances retrieved and loading into Binance`)
    }
  },

  async loadCoinbaseAccounts (context, done) {
    const response = await fetch('/api/coinbase/v2/accounts')
    let { data: accounts } = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.balance.amount))
    context.commit('setCoinbaseAccounts', accounts)
    if (done) {
      done(`${accounts.length} accounts retrieved and loading into Coinbase`)
    }
  },

  async loadCoinbaseProAccounts (context, done) {
    const response = await fetch('/api/coinbasepro/accounts')
    let accounts = response.status === 200 ? await response.json() : { status: response.status }
    accounts = accounts.filter(account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold))
    context.commit('setCoinbaseProAccounts', accounts)
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

  flyCoin (context, symbol) {
    context.commit('setFlyoutDrawer', true)
    context.commit('openCoinFlyout')
    context.commit('setFlyoutCoin', { symbol })
  },

  async fetchPrice (context, done) {
    const symbols = [context.state.flyoutCoin.symbol]
    const message = await fetchPrices(context, symbols)
    message && done && done(message)
  },

  async fetchPrices (context, done) {
    const message = await fetchPrices(context)
    done && done(message)
  },

  async fetchCoins (context, done) {
    const message = await fetchCoins(context)
    done && done(message)
  },

  flyRepository (context, repo) {
    context.commit('setFlyoutDrawer', true)
    context.commit('closeCoinFlyout')
    context.commit('openRepoFlyout')
    context.commit('setFlyoutRepo', repo)
  },

  async loadRepositorys (context, { force, done } = {}) {
    // const { force = false, done = undefined } = ref
    if (context.getters.repositorys.length === 0 || force) {
      await loadRepositorys(context)
      const activeRepos = context.getters.repositorys.filter(_ => _.active)
      context.commit('setSelectedRepos', activeRepos)
    }
    const symbols = context.getters.sortedUniqueSymbols
    const message = await fetchPrices(context, symbols)
    done && done(message)
  },

}
