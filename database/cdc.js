/*
** Crypto.com data assist
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
    const coin = Coin.query().where('symbol', tran.symbol).first()
    Transaction.insert({
      data: {
        repoId,
        date: tran.date,
        type: tran.type,
        coinId: coin.id,
        symbol: tran.symbol,
        quantity: tran.quantity,
        currency: tran.currency,
        timestamp: (new Date(tran.date)).getTime(),
      }
    })
  }
}
