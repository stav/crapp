import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

export function loadCoinbaseProAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbasepro = repos.where('name', 'Coinbase Pro').first()

  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbasepro.coins.find(coin => coin.coin?.symbol === symbol)
    let coin = Coin.query().where('symbol', symbol).first()
    if (!coin) {
      Coin.insert({ data: { symbol } })
      coin = Coin.query().where('symbol', symbol).first()
    }
    RepoCoin.insertOrUpdate({
      data: {
        id: repoCoin?.id,
        repoId: coinbasepro.id,
        coinId: coin.id,
        quantity: account ? parseFloat(account.balance) : 0,
      }
    })
  }
}

export function loadCoinbaseAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbase = repos.where('name', 'Coinbase').first()

  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbase.coins.find(coin => coin.coin?.symbol === symbol)
    let coin = Coin.query().where('symbol', symbol).first()
    if (!coin) {
      Coin.insert({ data: { symbol } })
      coin = Coin.query().where('symbol', symbol).first()
    }
    RepoCoin.insertOrUpdate({
      data: {
        id: repoCoin?.id,
        repoId: coinbase.id,
        coinId: coin.id,
        quantity: account ? parseFloat(account.balance.amount) : 0,
      }
    })
  }
}

export function loadBinanceBalances (balances) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const binance = repos.where('name', 'Binance').first()

  for (const balance of balances) {
    const symbol = balance.asset
    const repoCoin = binance.coins.find(coin => coin.coin?.symbol === symbol)
    let coin = Coin.query().where('symbol', symbol).first()
    if (!coin) {
      Coin.insert({ data: { symbol } })
      coin = Coin.query().where('symbol', symbol).first()
    }
    RepoCoin.insertOrUpdate({
      data: {
        id: repoCoin?.id,
        repoId: binance.id,
        coinId: coin.id,
        quantity: parseFloat(balance.free || 0) + parseFloat(balance.locked || 0),
      }
    })
  }
}

// const coins = repos.reduce(
//   (acc, cur, idx, src) => {
//     console.log('reduce', acc, cur, idx, src)
//     acc.add(cur)
//   }, new Set()
// )

export function loadRepositorys (repos) {
  // Add all coins
  for (const repo of repos) {
    for (const coin of repo.coins) {
      const _coin = Coin.query().where('symbol', coin.symbol).first()
      if (!_coin) {
        Coin.insert({ data: { symbol: coin.symbol } })
      }
    }
  }
  // Empty Repository tables
  Repository.deleteAll()
  RepoCoin.deleteAll()
  // Insert all the repos
  for (const repo of repos) {
    Repository.insert({
      data: {
        name: repo.name,
        coins: repo.coins.map(_ => ({
          coinId: Coin.query().where('symbol', _.symbol).first().id,
          quantity: _.quantity,
        })),
      }
    })
  }
}
