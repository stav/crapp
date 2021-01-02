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
export default async function fetchPrices (ctx, symbols) {
  const coinsUnlisted = ctx.getters.coinsUnlisted
  const coinsListed = symbols.filter(coin => !coinsUnlisted.includes(coin))
  if (coinsListed.length === 0) {
    return
  }
  const priceFetcherPath = '/api/cryptocompare/prices?symbols='
  const priceFetcherUrl = priceFetcherPath + coinsListed.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()
  let message

  if (result.error) {
    const e = result.error
    message = `Error in fetchPrices: ${e.message}, ${e.text}`
    console.error(message)
    return message
  }
  const { prices: data } = result
  for (const symbol of Object.keys(data)) {
    ctx.dispatch('setCoin', {
      symbol,
      price: data[symbol].USD,
    })
  }
  if (symbols.includes('USD')) {
    ctx.dispatch('setCoin', { symbol: 'USD', price: 1 })
  }
  if (symbols.length === 1) {
    return 'Loaded price for ' + symbols[0].toString()
  } else {
    const exceptions = coinsUnlisted.length ? `(except ${coinsUnlisted})` : ''
    return `Loaded prices ${exceptions}`
  }
}
