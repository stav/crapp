import Repository from '~/models/Repository'

// Return an array of unvalued repositories
export function repositorys (_state, getters) {
  return getters.Repositorys.all()
}

// Return an array of unvalued repositories with a high coin
export function highRepositorys (_state, getters) {
  const symbols = getters.sortedUniqueHighSymbols
  return getters.repositorys.filter((repo) => {
    return repo.coins.filter(coin => symbols.includes(coin.coin.symbol)).length
  })
}

// Return a Repository model
export function Repositorys () {
  return Repository.query().with(['coins', 'coins.coin', 'trans'])
}

// Return the flyout repository
export function flyoutRepo (state, getters) {
  const repoId = state.flyoutRepoId
  const repos = getters.Repositorys
  return repos.find(repoId) || {}
}

// // Return single repository based on given id
// repository: () => (id) => {
//   return Repository.find(id)
// },
