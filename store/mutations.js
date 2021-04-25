import { Coin, Transaction } from '~/models'

const coinPanelIndex = 0
const repoPanelIndex = 1
const stmtPanelIndex = 2

export default {
  setSelectedRepos (state, repos) {
    state.selectedRepos = repos
  },
  setNavVariant (state, mini) {
    state.navVariant = mini
  },
  setNavDrawer (state, fly) {
    state.navDrawer = fly
  },
  setFlyoutDrawer (state, fly) {
    state.flyoutDrawer = fly
  },
  setStatementBalances (state, value) {
    state.statementBalances = value
  },
  setBinanceTrades (state, value) {
    state.binanceTrades = value
  },
  setStatement (state, value) {
    state.statement = value
    if (!state.flyoutPanels.includes(stmtPanelIndex)) {
      state.flyoutPanels.push(stmtPanelIndex)
    }
  },
  toggleFlyout (state) {
    state.flyoutDrawer = !state.flyoutDrawer
  },
  openRepoFlyout (state) {
    if (!state.flyoutPanels.includes(repoPanelIndex)) {
      state.flyoutPanels.push(repoPanelIndex)
    }
  },
  openCoinFlyout (state) {
    if (!state.flyoutPanels.includes(coinPanelIndex)) {
      state.flyoutPanels.push(coinPanelIndex)
    }
  },
  closeCoinFlyout (state) {
    if (state.flyoutPanels.includes(coinPanelIndex)) {
      state.flyoutPanels.pop(coinPanelIndex)
    }
  },
  setFlyoutPanels (state, value) {
    state.flyoutPanels = value
  },
  setCoinPockets (state, value) {
    state.coinPockets = value
  },
  setRepoPockets (state, value) {
    state.repoPockets = value
  },
  setFlyoutCoin (state, { symbol }) {
    state.flyoutCoin = state.Coin.find(coin => coin.symbol === symbol)
  },
  setFlyoutRepo (state, repo) {
    state.flyoutRepoId = repo.id
  },
  toggleFooterAbsolute (state) {
    state.footerAbsolute = !state.footerAbsolute
  },
  setRepoCoinValue (state, value) {
    state.switchAmountValue = value
  },
  setRepoCoinValueRange (state, value) {
    state.repoCoinValueRange = value
  },
  setSparks (state, { symbol, data }) {
    symbol = symbol || state.flyoutCoin.symbol
    const sparks = {}
    sparks[symbol] = data
    state.sparks = Object.assign({ ...state.sparks }, sparks)
  },
  setSparkPair (state, { symbol, pair }) {
    symbol = symbol || state.flyoutCoin.symbol
    const sparkPair = {}
    sparkPair[symbol] = pair
    state.sparkPair = Object.assign({ ...state.sparkPair }, sparkPair)
  },
  setSnackbarModel (state, value) {
    state.snackbarModel = value
  },
  snackMessage (state, message) {
    state.snackbarText = message
    state.snackbarModel = true
  },

  addCoin (state, coin) {
    // Object.freeze(coin)
    state.Coin.push(new Coin(coin))
  },

  addRepository (state, repo) {
    // Object.freeze(repo)
    state.Repository.push(repo)
  },

  addStatement (state, statement) {
    Object.freeze(statement)
    state.Statement.push(statement)
  },

  addTransaction (state, transaction) {
    Object.freeze(transaction)
    state.Transaction.push(new Transaction(transaction))
  },

  setCoinPrice (state, { symbol, price }) {
    const coin = state.Coin.find(coin => coin.symbol === symbol)
    coin.price = price
  },

  setCoinData (state, data) {
    const coin = state.Coin.find(coin => coin.symbol === data.symbol.toUpperCase())
    delete data.id
    delete data.symbol
    Object.assign(coin, data)
  },

  setTradingviewSymbol (state, data) {
    state.tradingviewSymbols[data.symbol] = data.string
  },

  setBinanceBalances (state, balances) {
    setGeneralAccounts(
      state.Repository.find(repo => repo.name === 'Binance'),
      balances.map(balance => ({
        symbol: balance.asset,
        quantity: parseFloat(balance.free || 0) + parseFloat(balance.locked || 0),
      }))
    )
  },

  // Update the repo in the store with all the accounts we received
  setCoinbaseAmateurAccounts (state, accounts) {
    setGeneralAccounts(
      state.Repository.find(repo => repo.name === 'Coinbase'),
      accounts.map(account => ({
        symbol: account.currency,
        quantity: parseFloat(account?.balance?.amount) || 0,
      }))
    )
  },

  // Update the repo in the store with all the accounts we received
  setCoinbaseProAccounts (state, accounts) {
    setGeneralAccounts(
      state.Repository.find(repo => repo.name === 'Coinbase Pro'),
      accounts.map(account => ({
        symbol: account.currency,
        quantity: parseFloat(account?.balance) || 0,
      }))
    )
  },

}

// Update the repo in the store with all the account coins
function setGeneralAccounts (repo, accountCoins) {
  // For each account find the store coin and set the quantity
  for (const accountCoin of accountCoins) {
    const repoCoin = repo.coins.find(coin => coin.symbol === accountCoin.symbol)
    if (repoCoin) {
      repoCoin.quantity = accountCoin.quantity
    } else {
      repo.coins.push(accountCoin)
    }
  }

  // TODO
  // // Secondly remove any coins from repo in the db not in the accounts
  // for (const coin of repo.coins) {
  //   if (!accounts.find(account => account.currency === coin.coin.symbol)) {
  //     coin.$delete()
  //   }
  // }
}
