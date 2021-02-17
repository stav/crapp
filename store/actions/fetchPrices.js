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
** coinsUnlisted = [ "USD" ]
*/
async function getPrices (coinsUnlisted, symbols) {
  console.log('actions getPrices: in', coinsUnlisted, symbols)
  const coinsListed = symbols.filter(coin => !coinsUnlisted.includes(coin))
  if (coinsListed.length === 0) {
    throw new Error(`No listed coins ${coinsUnlisted}`)
  }
  const priceFetcherPath = '/api/cryptocompare/prices?symbols='
  const priceFetcherUrl = priceFetcherPath + coinsListed.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()
  console.log('actions getPrices: result', result)

  if (result.error) {
    throw new Error(result.error)
  }
  return result.prices
}

export default async function fetchPrices (ctx, symbols) {
  console.log('actions fetchPrices:', symbols)
  const coinsUnlisted = ctx.getters.coinsUnlisted
  let data
  try {
    data = await getPrices(coinsUnlisted, symbols)
  } catch (e) {
    console.warn(`Error in fetchPrices: ${e.message}`)
    return e.message
  }
  for (const symbol of Object.keys(data)) {
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
    const exceptions = coinsUnlisted.length ? `(except ${coinsUnlisted})` : ''
    return `Loaded prices ${exceptions}`
  }
}
