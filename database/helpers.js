import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

// const coins = repos.reduce(
//   (acc, cur, idx, src) => {
//     console.debug('reduce', acc, cur, idx, src)
//     acc.add(cur)
//   }, new Set()
// )

/*
** Update Repository Coin associative table
*/
export function updateRepoCoin (symbol, repoId, repoCoinId, quantity) {
  let coin = Coin.query().where('symbol', symbol).first()
  if (!coin) {
    Coin.insert({ data: { symbol } })
    coin = Coin.query().where('symbol', symbol).first()
  }
  RepoCoin.insertOrUpdate({
    data: {
      id: repoCoinId,
      repoId,
      coinId: coin.id,
      quantity,
    }
  })
}
