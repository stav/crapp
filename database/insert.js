import * as CryptoDotCom from './cdc'
import * as CoinbasePro from './coinbasepro'
import * as BlockFi from './blockfi'
import * as UniSwap from './uniswap'
import * as Kraken from './kraken'
import repositorys from '~/data/repositorys'
import Transaction from '~/models/Transaction'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

/*
** insertCoins
**
** Insert all given coins
*/
function insertCoins (entitys) {
  for (const entity of entitys || []) {
    const _coin = Coin.query().where('symbol', entity.symbol).first()
    if (!_coin) {
      Coin.insert({ data: { symbol: entity.symbol } })
    }
  }
}

/*
** insertTransactions
**
** Insert all given transactions
*/
function insertTransactions (repo) {
  const transactions = repo.transactions
  const [firstWordOfRepoName, _rest] = repo.name.split(/\s/) // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
  switch (firstWordOfRepoName.toLowerCase()) {
    case 'kraken':
      Kraken.insertTransactions(repo.id, transactions)
      break

    case 'blockfi':
      BlockFi.insertTransactions(repo.id, transactions)
      break

    case 'crypto.com':
      CryptoDotCom.insertTransactions(repo.id, transactions)
      break

    case 'uniswap':
      UniSwap.insertTransactions(repo.id, transactions)
      break

    case 'coinbase':
      CoinbasePro.insertTransactions(repo.id, transactions)
      break

    default:
      console.debug(`No transactions for repository (${repo.name})`)
  }
}

/*
** insertRepository
**
** Insert the given repository into the db
*/
function insertRepository (repo) {
  Repository.insert({
    data: {
      coins: repo.coins.map(_ => ({
        coinId: Coin.query().where('symbol', _.symbol).first().id,
        quantity: _.quantity,
      })),
      active: repo.active,
      name: repo.name,
    }
  })
}

/*
** insertRepositorys
**
** Insert all the given repositories into the db
*/
function insertRepositorys (inputs) {
  for (const input of inputs) {
    insertCoins(input.coins)
    insertCoins(input.transactions)
    insertRepository(input)
    insertTransactions({
      id: Repository.query().where('name', input.name).first().id,
      name: input.name,
      transactions: input.transactions,
    })
  }
}

/*
** loadRepositorys
**
** Read the list of repository data from input file and load up the db
*/
export async function loadRepositorys () {
  Coin.deleteAll()
  RepoCoin.deleteAll()
  Repository.deleteAll()
  Transaction.deleteAll()
  insertRepositorys(await repositorys())
}
