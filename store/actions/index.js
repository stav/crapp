import { loadRepositorys } from '@/database'
import loadKrakenSparks from './loadKrakenSparks'
import fetchPrices from './fetchPrices'
import fetchCoins from './fetchCoins'

export default {

  async getThingsGoing ({ dispatch, commit }) {
    commit('setGoing')
    await dispatch('loadRepositorys')
    await Promise.all([
      dispatch('loadBinanceBalances'),
      dispatch('loadCoinbaseAmateurAccounts'),
      dispatch('loadCoinbaseProAccounts'),
    ])
    dispatch('fetchPrices')
    dispatch('fetchCoins')
  },

  // nuxtServerInit (store, context) {
  //   for (const key in context) {
  //     console.log(key, typeof context[key] == 'object' ? Object.keys(context[key]) : context[key])
  //   }
  // },

  async loadBinanceBalances (context, done) {
    if (this.$config.canUseBinanceApi) {
      await loadGeneralAccounts(
        'Binance',
        'balances',
        'asset',
        '/api/binance/balances',
        'setBinanceBalances',
        () => true,
        context,
        done,
      )
    }
  },

  async loadCoinbaseAmateurAccounts (context, done) {
    if (this.$config.canUseCoinbaseApi) {
      await loadGeneralAccounts(
        'Coinbase',
        'data',
        'currency',
        '/api/coinbase/v2/accounts',
        'setCoinbaseAmateurAccounts',
        account => parseFloat(account.balance.amount),
        context,
        done,
      )
    }
  },

  async loadCoinbaseProAccounts (context, done) {
    if (this.$config.canUseCoinbaseProApi) {
      await loadGeneralAccounts(
        'Coinbase Pro',
        null,
        'currency',
        '/api/coinbasepro/accounts',
        'setCoinbaseProAccounts',
        account => parseFloat(account.available) || parseFloat(account.balance) || parseFloat(account.hold),
        context,
        done,
      )
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

  flyCoin ({ commit }, symbol) {
    commit('setFlyoutDrawer', true)
    commit('openCoinFlyout')
    commit('setFlyoutCoin', { symbol })
  },

  /**
   ** cacheTickers
   **
   ** @param symbols Array [ "ADA", "BTC", "ETH" ]
   */
  async cacheTickers ({ getters, commit }, symbols) {
    const allCoins = await getters.getAllCoins() // TODO return undefined if cached
    commit('cacheFullCoinList', allCoins) // TODO Only commit if allCoins not undefined

    const coins = await getters.getCoins(symbols)
    const data = await getters.getTickers(coins)

    for (const symbol in data) {
      const symbolData = data[symbol]
      symbolData.symbol = symbol
      commit('setCoinData', symbolData)
    }
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

async function loadGeneralAccounts(repoName, dataProp, symbolProp, url, action, filter, context, done) {
  const response = await fetch(url)
  let accounts = response.status === 200 ? await response.json() : { status: response.status }
  accounts = dataProp ? accounts[dataProp] : accounts
  accounts = accounts.filter(filter)

  // Make sure all the coins are in the store
  for (const account of accounts) {
    const symbol = account[symbolProp]
    const coin = context.state.Coin.find(coin => coin.symbol === symbol)
    if (!coin) {
      context.commit('addCoin', { symbol })
    }
  }

  // Commit the accounts data
  context.commit(action, accounts)

  // We're done
  done = done || (() => {}) // make sure done is defined
  done(`${accounts.length} accounts retrieved and loading into ${repoName}`)
}
