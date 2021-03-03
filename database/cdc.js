/*
** Crypto.com data assist
*/

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (CTX, repo) {
  for (const tran of (repo.trans || []).filter(t => t.type !== 'withdra')) {
    const coin = CTX.state.Coin.find(coin => coin.symbol === tran.symbol)
    const data = {
      repoId: repo.id,
      date: tran.date,
      type: tran.type,
      coinId: coin.id,
      note: `${tran.type} ${tran.quantity} ${tran.symbol} with Crypto.com on ${tran.date}`,
      quantity: tran.quantity,
    }
    console.log('cdc insertTransactions', data)
    CTX.commit('addTransaction', data)
  }
}
