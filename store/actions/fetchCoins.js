/*
** fetchCoins
*/
import { getCoins, getTickers } from './coingecko'

/*
** getSymbols
**
** return Array [ "ADA", "BNB", "BTC", "BUSD", "DOT", … ]
*/
function getSymbols(ctx) {
  const symbols = ctx.getters.sortedUniqueSymbols
  const symbolsUnlisted = ctx.getters.symbolsUnlisted
  const symbolsListed = symbols.filter(symbol => !symbolsUnlisted.includes(symbol))
  if (symbolsListed.length === 0) {
    throw new Error(`No coins: listed ${symbols}; unlisted ${symbolsUnlisted}`)
  }
  return symbolsListed
}

/*
** fetchCoins
**
*/
export default async function fetchCoins (ctx) {
  let symbols
  try {
    symbols = getSymbols(ctx)
    console.log('fetchCoins symbols', symbols)
  } catch (e) {
    console.warn(`Error in fetchCoins symbols: ${e.message}`)
    return e.message
  }

  let coins
  try {
    coins = await getCoins(symbols)
    console.log('fetchCoins coins', coins)
  } catch (e) {
    console.warn(`Error in fetchCoins coins: ${e.message}`)
    return e.message
  }

  let data
  try {
    // data = await getCoinsFromCoinmarketcap(symbols)
    data = await getTickers(coins)
    console.log('fetchCoins data', data)
  } catch (e) {
    console.warn(`Error in fetchCoins data: ${e.message}`)
    return e.message
  }

  for (const symbol in data) {
    const symbolData = data[symbol]
    symbolData.symbol = symbol
    ctx.commit('setCoinData', symbolData)
  }
  return 'Loaded coin data for ' + Object.keys(data)
}
