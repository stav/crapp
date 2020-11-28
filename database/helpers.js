import repositorys from '~/data/repositorys'
import Transaction from '~/models/Transaction'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

// const coins = repos.reduce(
//   (acc, cur, idx, src) => {
//     console.debug('reduce', acc, cur, idx, src)
//     acc.add(cur)
//   }, new Set()
// )

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
  for (const tran of repo.transactions || []) {
    const coin = Coin.query().where('symbol', tran.symbol).first()
    Transaction.insert({
      data: {
        date: tran.date,
        type: tran.type,
        repo: repo.name,
        coinId: coin.id,
        symbol: tran.symbol,
        quantity: tran.amount,
        currency: tran.currency,
      }
    })
  }
}

/*
** insertRepos
**
** Insert all the given repositories into the db
*/
function insertRepos (repos) {
  for (const repo of repos) {
    insertCoins(repo.coins)
    insertCoins(repo.transactions)
    insertTransactions(repo)
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
  insertRepos(await repositorys())
}

/*
** Update Repository Coin associative table
*/
export function updateRepoCoin (symbol, repoId, repoCoinId, quantity) {
  let coin = Coin.query().where('symbol', symbol).first()
  if (!coin) {
    Coin.insert({ data: { symbol } })
    coin = Coin.query().where('symbol', symbol).first()
  }
  RepoCoin.insertOrUpdate({
    data: {
      id: repoCoinId,
      repoId,
      coinId: coin.id,
      quantity,
    }
  })
}
