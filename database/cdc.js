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
  for (const tran of (trans || []).filter(t => t.type !== 'withdra')) {
    const coin = Coin.query().where('symbol', tran.symbol).first()
    Transaction.insert({
      data: {
        repoId,
        date: tran.date,
        type: tran.type,
        coinId: coin.id,
        note: `${tran.type} ${tran.quantity} ${tran.symbol} with Crypto.com on ${tran.date}`,
        quantity: tran.quantity,
        timestamp: (new Date(tran.date)).getTime(),
      }
    })
  }
}
