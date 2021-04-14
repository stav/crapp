import Getters from './getters'
import Actions from './actions'
import Mutations from './mutations'
import unSymbols from '~/data/unsymbols'

let constants
try {
  constants = require('~/data/constants')
} catch (error) {
  constants = {}
}

export const getters = Getters
export const actions = Actions
export const mutations = Mutations
export const state = () => ({
  symbolsUnlisted: unSymbols,
  statementBalances: false,
  statement: {},
  coinPockets: [],
  repoPockets: [],
  flyoutCoin: null,
  flyoutDrawer: null,
  flyoutPanels: [],
  flyoutRepoId: null,
  footerAbsolute: true,
  navDrawer: null,
  navVariant: true,
  switchAmountValue: true,
  repoCoinValueRange: [constants.COIN_VALUATION_RANGE_MIN, constants.COIN_VALUATION_RANGE_MAX || 999999],
  selectedRepos: [],
  snackbarModel: false,
  snackbarText: '',
  sparkPair: {},
  sparks: {},
  binanceTrades: [],

  Transaction: [],
  Repository: [],
  Statement: [],
  Coin: [],
})
