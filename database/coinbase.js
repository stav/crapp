import { updateRepoCoin } from './helpers'
import Repository from '~/models/Repository'

export function loadCoinbaseProAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbasepro = repos.where('name', 'Coinbase Pro').first()
  if (!coinbasepro) {
    return
  }

  // First update the repo in the db with all the accounts we received
  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbasepro.coins.find(coin => coin.coin?.symbol === symbol)
    const qtyFree = parseFloat(account?.balance) || 0
    updateRepoCoin(symbol, coinbasepro.id, repoCoin?.id, qtyFree)
  }

  // Secondly remove any coins from repo in the db not in the accounts
  for (const coin of coinbasepro.coins) {
    if (!accounts.find(account => account.currency === coin.coin.symbol)) {
      coin.$delete()
    }
  }
}

export function loadCoinbaseAccounts (accounts) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const coinbase = repos.where('name', 'Coinbase').first()
  if (!coinbase) {
    return
  }

  // First update the repo in the db with all the accounts we received
  for (const account of accounts) {
    const symbol = account.currency
    const repoCoin = coinbase.coins.find(coin => coin.coin?.symbol === symbol)
    const qtyFree = parseFloat(account?.balance?.amount) || 0
    updateRepoCoin(symbol, coinbase.id, repoCoin?.id, qtyFree)
  }

  // Secondly remove any coins from repo in the db not in the accounts
  for (const coin of coinbase.coins) {
    if (!accounts.find(account => account.currency === coin.coin.symbol)) {
      coin.$delete()
    }
  }
}
