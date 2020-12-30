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
  const priceFetcherPath = '/api/coinmarketcap/quotes?symbol='
  const priceFetcherUrl = priceFetcherPath + coinsListed.join(',')
  const response = await fetch(priceFetcherUrl)
  const result = await response.json()
  let message

  if (result.error) {
    const e = result.error
    message = `Error: ${e.message}, ${e.text}`
    console.error(message)
    return message
  }
  const { quotes: { data } } = result
  for (const coinData of Object.values(data)) {
    ctx.dispatch('setCoin', {
      symbol: coinData.symbol,
      price: coinData.quote.USD?.price,
      name: coinData.name,
      slug: coinData.slug,
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
