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
    const quantity = parseFloat(account?.balance) || 0
    updateRepoCoin(symbol, coinbasepro.id, repoCoin?.id, quantity)
  }

  // Secondly remove any coins from repo in the db not in the accounts
  for (const coin of coinbasepro.coins) {
    if (!accounts.find(account => account.currency === coin.coin.symbol)) {
      coin.$delete()
    }
  }
}
