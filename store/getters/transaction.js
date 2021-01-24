import Transaction from '~/models/Transaction'

// Return a Transaction model
export function Transactions () {
  return Transaction.query().with(['coin', 'repo'])
}

// Return an array of all transactions
export function transactions (_state, _getters) {
  return Transactions().all()
}

// Return a choronological array of transactions for a given coin id
export function coinTransactions (_state, _getters) {
  return (coinId) => {
    let balance = 0
    return Transactions()
      .where('coinId', coinId)
      .orderBy('timestamp')
      .get()
      .map(tran => Object.assign({}, tran, { balance: (balance += tran.quantity) }))
      .sort((a, b) => b.timestamp - a.timestamp)
  }
}
