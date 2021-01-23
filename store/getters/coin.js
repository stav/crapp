import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

/*
** coinPriceUSD
*/
export const coinPriceUSD = () => (symbol) => {
  return Coin.query().where('symbol', symbol).first()?.price
}

/*
** coinSum
*/
export const coinSum = state => (symbol) => {
  return RepoCoin
    .query()
    .with('coin') // Somehow this doesn't work...
    .where((repocoin) => {
      const coin = Coin.find(repocoin.coinId) // ...so we need to do this
      const selectedRepoIds = state.selectedRepos.map(_ => _.id)
      const included = selectedRepoIds.includes(repocoin.repoId)
      return included && coin.symbol === symbol
    })
    .get()
    .reduce((total, coin) => total + coin.quantity, 0)
}

/*
** sortedUniqueSymbols
**
** Coin.all() == [{
**   "id": "$uid1",
**   "name": "Bitcoin",
**   "slug": "bitcoin",
**   "price": 15298,
**   "symbol": "BTC"
** },…]
**
** return [ "BTC", … ]
*/
export function sortedUniqueSymbols () {
  const uniqueSymbols = new Set(Coin.all().map(coin => coin.symbol))
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
** coinsUnlisted
*/
export const coinsUnlisted = state => state.coinMarketCapUnlisted
