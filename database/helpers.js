import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

// const coins = repos.reduce(
//   (acc, cur, idx, src) => {
//     console.debug('reduce', acc, cur, idx, src)
//     acc.add(cur)
//   }, new Set()
// )

function getCoin(symbol) {
  return Coin.query().where('symbol', symbol).first()
}

/*
** Update Repository Coin associative table
*/
export function updateRepoCoin (symbol, repoId, repoCoinId, qtyFree = 0, qtyLocked = 0) {
  let coin = getCoin(symbol)
  if (!coin) {
    Coin.insert({ data: { symbol } })
    coin = getCoin(symbol)
  }
  RepoCoin.insertOrUpdate({
    data: {
      id: repoCoinId,
      repoId,
      coinId: coin.id,
      qtyFree,
      qtyLocked,
    }
  })
}
