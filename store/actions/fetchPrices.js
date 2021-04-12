/*
** fetchPrices
**
** Fetch current market prices for all coins in all repositories
**
** result = {
**   quotes: {
**     data: { BTC:{…}, ETH:{…}, … },
**     status: {…}
**   }
** }
**
** data = {
**   BTC: Object { id: 1, name: "Bitcoin", symbol: "BTC", … },
**   ETH: Object { id: 1027, name: "Ethereum", symbol: "ETH", … },
**   {…}
** }
**
** coinData = {
**   id: 1,
**   symbol: "BTC",
**   name: "Bitcoin",
**   slug: "bitcoin",
**   quote: { USD: { price: 13814.127956929022, … } },…
** }
**
** coin =
**   { symbol: "BTC", price: 13814.127956929022 }
**
** unlisted = [ "CGLD", "USD" ]
**
** symbolsUnlisted = [ "USD" ]
*/

async function getPrices (symbols) {
  const priceFetcherPath = '/api/cryptocompare/prices?symbols='
  const priceFetcherUrl = priceFetcherPath + symbols.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()

  if (result.error) {
    throw new Error(result.error)
  }
  return result.prices
}

export default async function fetchPrices (ctx) {
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
    data = await getPrices(symbolsListed)
  } catch (e) {
    console.warn(`Error in fetchPrices: ${e.message}`)
    return e.message
  }
  for (const symbol in data) {
    ctx.commit('setCoinPrice', {
      symbol,
      price: data[symbol].USD,
    })
  }
  if (symbols.includes('USD')) {
    ctx.commit('setCoinPrice', { symbol: 'USD', price: 1 })
  }
  if (symbols.length === 1) {
    return 'Loaded price for ' + symbols[0].toString()
  } else {
    const exceptions = symbolsUnlisted.length ? `(except ${symbolsUnlisted})` : ''
    return `Loaded prices ${exceptions}`
  }
}
