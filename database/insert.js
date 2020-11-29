import * as CryptoDotCom from './cdc'
import * as BlockFi from './blockfi'
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
  switch (repo.name.toLowerCase()) {
    case 'kraken':
      Kraken.insertTransactions(repo)
      break

    case 'blockfi':
      BlockFi.insertTransactions(repo)
      break

    case 'crypto wallet':
      CryptoDotCom.insertTransactions(repo)
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
function insertRepositorys (repos) {
  for (const repo of repos) {
    insertCoins(repo.coins)
    insertCoins(repo.transactions)
    insertTransactions(repo)
    insertRepository(repo)
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
