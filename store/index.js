import Getters from './getters'
import Actions from './actions'
import Mutations from './mutations'
import unSymbols from '~/data/unsymbols'

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
  repoCoinValueFloor: 1000,
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
