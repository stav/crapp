/*
** Coinbase Pro data assist
*/
import { Repository, Statement, Statements } from '~/models'

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
export function insertStatements (CTX: any, repo: Repository) {
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
