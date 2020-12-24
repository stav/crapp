import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Getters from './getters'
import Actions from './actions'
import Mutations from './mutations'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'Skey', 'USD', 'UNIV2'],
  statementBalances: false,
  flyoutCoin: null,
  coinPockets: [],
  repoPockets: [],
  flyoutDrawer: null,
  flyoutPanels: [],
  flyoutRepoId: null,
  footerAbsolute: true,
  navDrawer: null,
  navVariant: true,
  repoCoinValue: true,
  repoZeroCoins: false,
  selectedRepos: [],
  snackbarModel: false,
  snackbarText: '',
  sparkPair: {},
  sparks: {},
})

export const getters = Getters
export const actions = Actions
export const mutations = Mutations
