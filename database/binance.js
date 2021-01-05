import { updateRepoCoin } from './helpers'
import Repository from '~/models/Repository'

export function loadBinanceBalances (balances) {
  const repos = Repository.query().with(['coins', 'coins.coin'])
  const binance = repos.where('name', 'Binance').first()
  if (!binance) {
    return
  }

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
    if (balances.find(balance => balance.asset === coin.coin.symbol)) {
      // RepoCoin.update({
      //   where: coin.id,
      //   data: { quantity }
      // })
    } else {
      coin.$delete()
    }
  }
}
