import Coin from '~/models/Coin'

const coinPanelIndex = 0
const repoPanelIndex = 1

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
    state.flyoutCoin = Coin.query().where('symbol', symbol).first()
  },
  setFlyoutRepo (state, repo) {
    state.flyoutRepoId = repo.id
  },
  toggleFooterAbsolute (state) {
    state.footerAbsolute = !state.footerAbsolute
  },
  setRepoCoinValue (state, value) {
    state.repoCoinValue = value
  },
  setRepoZeroCoins (state, value) {
    state.repoZeroCoins = value
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
}
