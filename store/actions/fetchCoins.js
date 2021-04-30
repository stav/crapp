/*
** fetchCoins
*/

async function getCoins (symbols) {
  const priceFetcherPath = '/api/coinmarketcap/quotes?symbol='
  const priceFetcherUrl = priceFetcherPath + symbols.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()

  if (result.error) {
    const e = result.error
    throw new Error(`${e.message}: ${e.text}`)
  }
  return result.quotes.data
}

export default async function fetchCoins (ctx) {
  const symbols = ctx.getters.sortedUniqueSymbols
  const symbolsUnlisted = ctx.getters.symbolsUnlisted
  const symbolsListed = symbols.filter(symbol => !symbolsUnlisted.includes(symbol))
  if (symbolsListed.length === 0) {
    const message = `No coins: listed ${symbols}; unlisted ${symbolsUnlisted}`
    console.warn(message)
    return message
  }

  let data
  try {
    data = await getCoins(symbolsListed)
  } catch (e) {
    console.warn(`Error in fetchCoins: ${e.message}`)
    return e.message
  }
  for (const symbol in data) {
    ctx.commit('setCoinData', data[symbol])
  }
  return 'Loaded coin data for ' + Object.keys(data)
}
