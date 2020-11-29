/*
** Kraken data assist
*/
import Transaction from '~/models/Transaction'
import Coin from '~/models/Coin'

/*
** Finals
*/
const dateStringRegex = /(?<M>\d{2})-(?<D>\d{2})-(?<Y>\d{2}) (?<h>\d{2}):(?<m>\d{2}):(?<s>\d{2}) \+\d{4}/

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (repo) {
  console.log('Kraken insertTransactions', repo)
  for (const tran of repo.transactions || []) {
    const coin = Coin.query().where('symbol', tran.symbol).first()
    Transaction.insert({
      data: {
        date: tran.date,
        type: tran.type,
        repo: repo.name,
        coinId: coin.id,
        symbol: tran.symbol,
        quantity: tran.amount,
        currency: tran.currency,
        timestamp: getTransTimestamp(tran.date),
      }
    })
  }
}

function getTransTimestamp (dateString) {
  console.log('Kraken getTransTimestamp', dateString)
  const groups = dateStringRegex.exec(dateString).groups
  const { Y, M, D, h, m, s } = Object.assign({ h: 0, m: 0, s: 0 }, groups)
  const iY = parseInt(Y)
  const day = parseInt(D)
  const year = iY < 100 ? 2000 + iY : iY
  const month = parseInt(M) - 1
  const timestamp = Date.UTC(year, month, day, h, m, s)
  return timestamp
}
