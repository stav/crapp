import VuexORM from '@vuex-orm/core'
import database from '@/database'
import Getters from './getters'
import Actions from './actions'
import Mutations from './mutations'

export const plugins = [
  VuexORM.install(database)
]

export const state = () => ({
  coinMarketCapUnlisted: ['CGLD', 'USD'],
  flyoutCoin: null,
  flyoutDrawer: null,
  flyoutPanels: [],
  flyoutRepoId: null,
  footerAbsolute: true,
  repoCoinValue: true,
  navDrawer: null,
  selectedRepos: [],
  sparkPair: {},
  sparks: {},
})

export const getters = Getters
export const actions = Actions
export const mutations = Mutations
