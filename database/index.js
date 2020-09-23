import { Database } from '@vuex-orm/core'
import Repository from '~/models/Repository'
import Price from '~/models/Price'
import Coin from '~/models/Coin'

const database = new Database()

database.register(Repository)
database.register(Price)
database.register(Coin)

export default database
