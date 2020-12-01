/*
** UniSwap data assist
*/
import Transaction from '~/models/Transaction'
import Coin from '~/models/Coin'

const dateStringRegex = /(?<M>\w{3})-(?<D>\d{2})-(?<Y>\d{4}) (?<h>\d{2}):(?<m>\d{2}):(?<s>\d{2}) (?<A>AM|PM)/
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (repo) {
  for (const tran of repo.transactions || []) {
    const coin = Coin.query().where('symbol', tran.symbol).first()
    const data = {
      date: tran.date,
      type: tran.type,
      repo: repo.name,
      coinId: coin.id,
      symbol: tran.symbol,
      quantity: tran.quantity,
      currency: tran.currency,
      timestamp: getTransTimestamp(tran.date),
    }
    Transaction.insert({ data })
  }
}

/*
** getTransTimestamp
**
** Return Integer Linux timestamp
*/
function getTransTimestamp (dateString) {
  const { Y, M, D, h, m, s, A } = dateStringRegex.exec(dateString).groups
  const iY = parseInt(Y)
  const ih = parseInt(h)

  const day = parseInt(D)
  const year = iY < 100 ? 1900 + iY : iY
  const month = months.indexOf(M)

  const hour = A === 'A' ? ih : ih + 12

  return Date.UTC(year, month, day, hour, m, s)
}
