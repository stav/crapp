/*
** Coinbase Pro data assist
*/
import { object } from '@amcharts/amcharts4/core'
import { IRepository, Statement, Statements, Transaction } from '~/models'

/*
** mapTransactionSymbols
**
** Map a list of the transactions symbols
*/
export function mapTransactionSymbols (trans: any[]) {
  return trans?.map(tran => tran['size unit']) || []
}

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (CTX: any, repo: IRepository) {
  console.log('insertTransactions', repo)
  for (const tran of repo.transactions || []) {
    const symbol = tran['size unit']
    const date = tran['created at']
    const size = parseFloat(tran.size)
    const coin = CTX.state.Coin.find((coin: any) => coin.symbol === symbol)

    const data = {
      repoId: repo.id,
      date,
      fee: parseFloat(tran.fee),
      type: tran.side,
      note: `${tran.side} ${tran.size} ${symbol} for ${tran.price} each with CoinbasePro on ${date}`,
      coinId: coin.id,
      quantity: tran.side.toUpperCase() === 'SELL' ? size * -1 : size,
      timestamp: (new Date(date)).getTime(),
    }
    // console.log('coinbase insertTransactions', data)
    CTX.commit('addTransaction', data)
  }
}

/*
** insertStatements
**
** Insert all given statements
**
** { "id": "$uid1147",
**   "name": "Coinbase Pro",
**   "slug": "coinbase",
**   "statements": [
**     {
**       "portfolio": "default",
**       "type": "match",
**       "time": "2020-09-05T18:53:53.669Z",
**       "amount": "0.02",
**       "balance": "0.02",
**       "amount/balance unit": "BTC",
**       "transfer id": "",
**       "trade id": "102554985",
**       "order id": "295a7f6c-c1ea-499a-8ac1-f0e2e84fe1e8"
**     },... ] }
*/
export function insertStatements (CTX: any, repo: IRepository) {
  const statement = new Statements(repo.statements)
  const orders = statement.getOrders()
  for (const order of orders) {
    const data = {
      repoId: repo.id,
      fee: order.fee,
      match: order.match,
      deposit: order.deposit,
      withdrawal: order.withdrawal,
      timestamp: order.date.getTime(),
    }
    CTX.commit('addStatement', new Statement(data))
  }
}
