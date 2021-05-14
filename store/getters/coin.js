export { getAllCoins, getCoins, getTickers, symbolTicker } from './coingecko'

/** coinPriceUSD
 **
 ** @param symbol String "BNB"
 **
 ** @returns Number 577.83
 */
export const coinPriceUSD = state => (symbol) => {
  try {
    return state.Coin.find(coin => coin.symbol === symbol)?.price
  } catch (error) {
    console.error('symbol', symbol, error)
  }
}

/** coinSum
 **
 ** @param symbol String "BTC"
 **
 ** @returns Number 100
 */
export const coinSum = state => (symbol) => {
  const selectedRepoIds = state.selectedRepos.map(_ => _.id)
  return state.Repository
    .filter(repo => selectedRepoIds.includes(repo.id))
    .map(repo => repo.coins.filter(coin => coin.symbol === symbol))
    .flat()
    .reduce((total, coin) => total + coin.quantity, 0)
}

/** sortedUniqueSymbols
 **
 ** @returns Array [ "BBB", "BNB", "BTC",… ]
 */
export function sortedUniqueSymbols (state) {
  const uniqueSymbols = new Set(state.Coin.map(coin => coin.symbol))
  return Array.from(uniqueSymbols).sort()
}

export function sortedUniqueRangedSymbols (state, getters) {
  return getters.sortedUniqueSymbols.filter((symbol) => {
    const amount = getters.coinSum(symbol)
    const price = getters.coinPriceUSD(symbol)
    const value = amount * price
    const range = state.repoCoinValueRange
    return (range[0] <= value) && (value <= range[1])
  })
}

/** symbolsUnlisted
 **
 ** @returns Array [ "BBB" ]
 */
export const symbolsUnlisted = state => state.symbolsUnlisted

/** getSymbols
 **
 ** @returns Array [ "BNB", "BTC", "BUSD",… ]
 */
export function getSymbols (_state, getters) {
  const symbols = getters.sortedUniqueSymbols
  const symbolsUnlisted = getters.symbolsUnlisted
  const symbolsListed = symbols.filter(symbol => !symbolsUnlisted.includes(symbol))
  if (symbolsListed.length === 0) {
    throw new Error(`No coins: listed ${symbols}; unlisted ${symbolsUnlisted}`)
  }
  return symbolsListed
}
