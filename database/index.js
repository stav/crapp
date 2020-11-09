import { Database } from '@vuex-orm/core'
import { loadRepositorys } from './helpers'
import { loadBinanceBalances } from './binance'
import { loadCoinbaseAccounts, loadCoinbaseProAccounts } from './coinbase'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

const database = new Database()

database.register(Repository)
database.register(RepoCoin)
database.register(Coin)

export default database

export {
  loadCoinbaseProAccounts,
  loadCoinbaseAccounts,
  loadBinanceBalances,
  loadRepositorys,
}
