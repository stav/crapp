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
export function insertTransactions (repo) {
  console.log('BlockFi insertTransactions', repo)
  for (const tran of repo.transactions || []) {
    const coin = Coin.query().where('symbol', tran.symbol).first()
    Transaction.insert({
      data: {
        date: tran.date,
        type: tran.type,
        repo: repo.name,
        coinId: coin.id,
        symbol: tran.symbol,
        quantity: tran.quantity,
        currency: tran.currency,
        timestamp: (new Date(tran.date)).getTime(),
      }
    })
  }
}
