/*
** Kraken data assist
*/
import Transaction from '~/models/Transaction'
import Coin from '~/models/Coin'

const dateStringRegex = /(?<Y>\d{4})-(?<M>\d{2})-(?<D>\d{2}) (?<h>\d{2}):(?<m>\d{2}):(?<s>\d{2})/
const coinTranslator = {
  XXBT: 'BTC',
  XETH: 'ETH',
}

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (repoId, trans) {
  for (const tran of trans || []) {
    const symbol = coinTranslator[tran.asset] ?? tran.asset
    const coin = Coin.query().where('symbol', symbol).first()
    Transaction.insert({
      data: {
        repoId,
        date: tran.time,
        type: tran.type,
        coinId: coin.id,
        note: `${tran.type} ${tran.amount} ${tran.asset} with Kraken on ${tran.time}`,
        quantity: tran.amount,
        timestamp: getTransTimestamp(tran.time),
      }
    })
  }
}

function getTransTimestamp (dateString) {
  const { Y, M, D, h, m, s } = dateStringRegex.exec(dateString).groups
  const day = parseInt(D)
  const year = parseInt(Y)
  const month = parseInt(M) - 1
  const timestamp = Date.UTC(year, month, day, h, m, s)
  return timestamp
}
