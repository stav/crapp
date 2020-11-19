import repositorys from '~/data/repositorys'
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
** Insert Coins
**
** Insert all coins found in the given repositories into the db
*/
function insertCoins (repos) {
  for (const repo of repos) {
    for (const coin of repo.coins) {
      const _coin = Coin.query().where('symbol', coin.symbol).first()
      if (!_coin) {
        Coin.insert({ data: { symbol: coin.symbol } })
      }
    }
  }
}

/*
** Insert Repositories
**
** Insert all the given repositories into the db
*/
function insertRepos (repos) {
  insertCoins(repos)
  for (const repo of repos) {
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
** Load Repositories
**
** Read the list of repository data from input file and load up the db
*/
export async function loadRepositorys () {
  Repository.deleteAll()
  RepoCoin.deleteAll()
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
