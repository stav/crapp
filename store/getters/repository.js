// Return an array of unvalued repositories
export function repositorys (state) {
  return state.Repository
}

// Return an array of unvalued repositories with a high coin
export function highRepositorys (_state, getters) {
  const symbols = getters.sortedUniqueHighSymbols
  return getters.repositorys.filter((repo) => {
    return repo.coins.filter(coin => symbols.includes(coin.symbol) && coin.quantity > 0).length
  })
}

// Return the flyout repository
export function flyoutRepo (state, getters) {
  const repoId = state.flyoutRepoId
  const repo = getters.repositorys.find(repo => repo.id === repoId)
  return repo || {}
}

// Return single repository based on given name
export function repositoryFromSlug (_state, getters) {
  return slug => getters.repositorys.find(repo => repo.slug === slug)
}
