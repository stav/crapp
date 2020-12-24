import { Database } from '@vuex-orm/core'
import { loadRepositorys } from './insert'
import { loadBinanceBalances } from './binance'
import { loadCoinbaseAccounts, loadCoinbaseProAccounts } from './coinbase'
import Statement from '~/models/Statement'
import Transaction from '~/models/Transaction'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

const database = new Database()

database.register(Transaction)
database.register(Repository)
database.register(Statement)
database.register(RepoCoin)
database.register(Coin)

export default database

export {
  loadCoinbaseProAccounts,
  loadCoinbaseAccounts,
  loadBinanceBalances,
  loadRepositorys,
}
