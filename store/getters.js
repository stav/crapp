import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

export default {

  coinPriceUSD: () => (symbol) => {
    return Coin.query().where('symbol', symbol).first()?.price
  },

  coinSum: state => (symbol) => {
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
  },
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
  sortedUniqueSymbols: () => () => {
    const uniqueSymbols = new Set(Coin.all().map(coin => coin.symbol))
    return Array.from(uniqueSymbols).sort()
  },

  coinsUnListed: state => () => state.coinMarketCapUnlisted,

  sparkLines: state => symbol => state.sparks[symbol || state.flyoutCoin?.symbol] || [],

  sparkPair: state => () => state.sparkPair[state.flyoutCoin?.symbol] || '',
}
