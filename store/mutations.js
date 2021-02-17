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
  setRepoCoinValueFloor (state, value) {
    state.repoCoinValueFloor = value
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
    state.Coin.push(coin)
  },

  addRepository (state, repo) {
    // Object.freeze(repo)
    state.Repository.push(repo)
  },

  setCoinPrice (state, { symbol, price }) {
    const coin = state.Coin.find(coin => coin.symbol === symbol)
    coin.price = price
  },

  setBinanceBalances (state, balances) {
    const binance = state.Repository.find(repo => repo.name === 'Binance')
    if (!binance) {
      console.error('No Binance repository for balances', balances)
      return
    }

    // First update the repo in the db with all the balances we received
    for (const balance of balances) {
      const free = parseFloat(balance.free || 0)
      const locked = parseFloat(balance.locked || 0)
      const symbol = balance.asset
      const quantity = free + locked
      let coin = binance.coins.find(coin => coin.symbol === symbol)
      if (coin) {
        coin.quantity = quantity
      } else {
        // TODO Need many-to-many RepoCoin
        state.Coin.push({ symbol })
        coin = { symbol, quantity }
        binance.coins.push(coin)
      }
    }

    // Secondly remove any coins from repo in the db not in the balances
    for (const coin of binance.coins) {
      if (!balances.find(balance => balance.asset === coin.symbol)) {
        // TODO Remove coin
        console.warn('setBinanceBalances: remove', coin)
      }
    }
  },

  setCoinbaseAccounts (state, accounts) {
    const coinbase = state.Repository.find(repo => repo.name === 'Coinbase')
    console.log('setCoinbaseAccounts: repo', coinbase)
    if (!coinbase) {
      console.error('No Coinbase repository for accounts', accounts)
      return
    }

    // First update the repo in the db with all the accounts we received
    for (const account of accounts) {
      const symbol = account.currency
      const quantity = parseFloat(account?.balance?.amount) || 0
      let coin = coinbase.coins.find(coin => coin.symbol === symbol)
      if (coin) {
        coin.quantity = quantity
        console.log('setCoinbaseAccounts: update', coin)
      } else {
        // TODO Need many-to-many RepoCoin
        state.Coin.push({ symbol })
        coin = { symbol, quantity }
        coinbase.coins.push(coin)
        console.log('setCoinbaseAccounts: add', coin)
      }
    }

    // TODO
    // // Secondly remove any coins from repo in the db not in the accounts
    // for (const coin of coinbase.coins) {
    //   if (!accounts.find(account => account.currency === coin.coin.symbol)) {
    //     coin.$delete()
    //   }
    // }
  },

}
