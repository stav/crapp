import repositorys from '~/data/repositorys'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

function updateRepoCoin (symbol, repoId, repoCoinId, quantity) {
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

export function loadCoinbaseProAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbasepro = repos.where('name', 'Coinbase Pro').first()

  // First update the repo in the db with all the accounts we received
  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbasepro.coins.find(coin => coin.coin?.symbol === symbol)
    const quantity = parseFloat(account?.balance) || 0
    updateRepoCoin(symbol, coinbasepro.id, repoCoin?.id, quantity)
  }

  // Secondly remove any coins from repo in the db not in the accounts
  for (const coin of coinbasepro.coins) {
    const symbol = coin.coin.symbol
    if (!accounts.find(account => account.currency === symbol)) {
      coin.$delete()
    }
  }
}

export function loadCoinbaseAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbase = repos.where('name', 'Coinbase').first()

  // First update the repo in the db with all the accounts we received
  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbase.coins.find(coin => coin.coin?.symbol === symbol)
    const quantity = parseFloat(account?.balance?.amount) || 0
    updateRepoCoin(symbol, coinbase.id, repoCoin?.id, quantity)
  }

  // Secondly remove any coins from repo in the db not in the accounts
  for (const coin of coinbase.coins) {
    const symbol = coin.coin.symbol
    if (!accounts.find(account => account.currency === symbol)) {
      coin.$delete()
    }
  }
}

export function loadBinanceBalances (balances) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const binance = repos.where('name', 'Binance').first()

  // First update the repo in the db with all the balances we received
  for (const balance of balances) {
    const symbol = balance.asset
    const repoCoin = binance.coins.find(coin => coin.coin?.symbol === symbol)
    const free = parseFloat(balance.free || 0)
    const locked = parseFloat(balance.locked || 0)
    const quantity = free + locked
    updateRepoCoin(symbol, binance.id, repoCoin?.id, quantity)
  }

  // Secondly remove any coins from repo in the db not in the balances
  for (const coin of binance.coins) {
    const symbol = coin.coin.symbol
    if (balances.find(balance => balance.asset === symbol)) {
      // RepoCoin.update({
      //   where: coin.id,
      //   data: { quantity }
      // })
    } else {
      coin.$delete()
    }
  }
}

// const coins = repos.reduce(
//   (acc, cur, idx, src) => {
//     console.log('reduce', acc, cur, idx, src)
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
        name: repo.name,
        coins: repo.coins.map(_ => ({
          coinId: Coin.query().where('symbol', _.symbol).first().id,
          quantity: _.quantity,
        }))
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
