/*
** Coinbase Pro data assist
*/
import Transaction from '~/models/Transaction'
import Coin from '~/models/Coin'

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (repoId, trans) {
  for (const tran of trans || []) {
    const symbol = tran['size unit']
    const date = tran['created at']
    const size = parseFloat(tran.size)
    const coin = Coin.query().where('symbol', symbol).first()
    const data = {
      repoId,
      symbol,
      date,
      fee: parseFloat(tran.fee),
      type: tran.side,
      note: `${tran.side} ${tran.size} ${symbol} for ${tran.price} each`,
      coinId: coin.id,
      quantity: tran.side.toUpperCase() === 'SELL' ? size * -1 : size,
      currency: parseFloat(tran.price),
      timestamp: (new Date(date)).getTime(),
    }
    Transaction.insert({ data })
  }
}

/*
** mapTransactionSymbols
**
** Map a list of the transactions symbols
*/
export function mapTransactionSymbols (trans) {
  return trans?.map(tran => tran['size unit']) || []
}
