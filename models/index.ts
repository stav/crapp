import { v4 as uuidv4 } from 'uuid'

export interface IRepository {
  id: string
  name: string
  slug: string
  pairs: string[]
  coins: object[]
  active: boolean
  statements: object[]
  transactions: any[]
}

interface ICoin {
  id: string
  name: string
  slug: string
  symbol: string
  price: number
}

export class Repository implements IRepository {

  id = uuidv4()
  name = ''
  slug = ''
  coins = []
  pairs = []
  statements = []
  transactions = []
  active = true

  constructor (options: IRepository) {
    const defaults = {
      slug: options.name.toLowerCase().replace(/\s/g, '-').replace(/[.()]/g, ''),
    }
    Object.assign(this, defaults, options)
    this.pairs = this.pairs || [] // can't be nullish
    this.coins = this.coins || [] // can't be nullish
    this.statements = this.statements || [] // can't be nullish
    this.transactions = this.transactions || [] // can't be nullish
  }

}

export class Coin implements ICoin {

  id = uuidv4()
  name = ''
  slug = ''
  symbol = ''
  price = 0.0

  constructor (options: ICoin) {
    Object.assign(this, {
      name: options.symbol,
      slug: options.symbol.toLowerCase(),
      symbol: options.symbol.toUpperCase(),
    }, options)
  }

}

export class Transaction {

  id = uuidv4()
  date: string = ''
  type: string = ''
  note: string = ''
  repoId: string = ''
  coinId: string = ''
  quantity: number = 0
  timestamp: number = 0

  constructor (options: Transaction) {
    const defaults = {
      timestamp: (new Date(options.date)).getTime(),
    }
    Object.assign(this, defaults, options)
  }

}

export class Statement {

  fee: object = {}
  match: object = {}
  deposit: object = {}
  withdrawal: object = {}
  repoId: string
  timestamp: number

  constructor (options: Statement) {
    this.repoId = options.repoId
    this.timestamp = options.timestamp
    if (options.fee) this.fee = options.fee
    if (options.match) this.match = options.match
    if (options.deposit) this.deposit = options.deposit
    if (options.withdrawal) this.withdrawal = options.withdrawal
  }

}

/*
** Statements
*/
export class Statements {
  #orders: any = {}
  #depositId: number = 0

  constructor(stmts: object[]) {
    for (const stmt of stmts || []) {
      this.add(Object.assign({}, stmt))
    }
  }

  add (statement: any) {
    const oId = statement['order id']
    if (!oId) {
      statement['order id'] = ++this.#depositId
    }
    this.order(statement)
  }

  order (statement: any) {
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
