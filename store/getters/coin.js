/*
** coinPriceUSD
*/
export const coinPriceUSD = state => (symbol) => {
  try {
    return state.Coin.find(coin => coin.symbol === symbol)?.price
  } catch (error) {
    console.error('symbol', symbol, error)
  }
}

/*
** coinSum
*/
export const coinSum = state => (symbol) => {
  const selectedRepoIds = state.selectedRepos.map(_ => _.id)
  return state.Repository
    .filter(repo => selectedRepoIds.includes(repo.id))
    .map(repo => repo.coins.filter(coin => coin.symbol === symbol))
    .flat()
    .reduce((total, coin) => total + coin.quantity, 0)
}

/*
** sortedUniqueSymbols
**
** return [ "BTC", … ]
*/
export function sortedUniqueSymbols (state) {
  const uniqueSymbols = new Set(state.Coin.map(coin => coin.symbol))
  return Array.from(uniqueSymbols).sort()
}

export function sortedUniqueHighSymbols (state, getters) {
  return getters.sortedUniqueSymbols.filter((symbol) => {
    const amount = getters.coinSum(symbol)
    const price = getters.coinPriceUSD(symbol)
    const value = amount * price
    const floor = state.repoCoinValueFloor
    return value >= floor
  })
}

/*
** symbolsUnlisted
*/
export const symbolsUnlisted = state => state.symbolsUnlisted
