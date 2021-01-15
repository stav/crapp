/*
** Coinbase Pro data assist
*/
import Transaction from '~/models/Transaction'
import Statement from '~/models/Statement'
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
      date,
      fee: parseFloat(tran.fee),
      type: tran.side,
      note: `${tran.side} ${tran.size} ${symbol} for ${tran.price} each with CoinbasePro on ${date}`,
      coinId: coin.id,
      quantity: tran.side.toUpperCase() === 'SELL' ? size * -1 : size,
      timestamp: (new Date(date)).getTime(),
    }
    Transaction.insert({ data })
  }
}

/*
** Statements
*/
class Statements {
  #orders = {}
  #depositId = 0

  constructor(stmts) {
    for (const stmt of stmts || []) {
      this.add(stmt)
    }
  }

  add (statement) {
    const oId = statement['order id']
    if (!oId) {
      statement['order id'] = ++this.#depositId
    }
    this.order(statement)
  }

  order (statement) {
    const oId = statement['order id']
    const order = this.#orders[oId] || {}
    order.date = new Date(statement.time)
    const type = statement.type
    if (!(type in order)) {
      order[type] = {}
    }
    const unit = statement['amount/balance unit']
    const amount = parseFloat(statement.amount) + (order[type][unit]?.amount || 0)
    const balance = parseFloat(statement.balance)
    order[type][unit] = { amount, balance }
    this.#orders[oId] = order
  }

  getOrders () {
    return Object
      .keys(this.#orders)
      .map(oId => this.#orders[oId])
      .sort((a, b) => a.date - b.date)
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
**   "stmts": [
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
export function insertStatements (repo) {
  const statement = new Statements(repo.stmts)
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
    Statement.insert({ data })
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
