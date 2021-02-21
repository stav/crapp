/*
** fetchCoins
*/
async function getCoins (coinsUnlisted, symbols) {
  const coinsListed = symbols.filter(coin => !coinsUnlisted.includes(coin))
  if (coinsListed.length === 0) {
    throw new Error(`No listed coins ${coinsUnlisted}`)
  }
  const priceFetcherPath = '/api/coinmarketcap/quotes?symbol='
  const priceFetcherUrl = priceFetcherPath + coinsListed.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()

  if (result.error) {
    throw new Error(result.error)
  }
  return result.quotes.data
}

export default async function fetchCoins (ctx) {
  const symbols = ctx.getters.sortedUniqueSymbols
  const coinsUnlisted = ctx.getters.coinsUnlisted
  let data
  try {
    data = await getCoins(coinsUnlisted, symbols)
  } catch (e) {
    console.warn(`Error in fetchCoins: ${e.message}`)
    return e.message
  }
  for (const symbol of Object.keys(data)) {
    ctx.commit('setCoinData', data[symbol])
  }
  return 'Loaded coin data for ' + Object.keys(data)
}
