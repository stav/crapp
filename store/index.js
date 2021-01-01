import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Getters from './getters'
import Actions from './actions'
import Mutations from './mutations'
import unCoins from '~/data/uncoins'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: unCoins,
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
})

export const getters = Getters
export const actions = Actions
export const mutations = Mutations
