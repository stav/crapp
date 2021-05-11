/*
** coingecko
**
** https://api.coingecko.com/api/v3/coins?per_page=250&page=1
** https://api.coingecko.com/api/v3/coins/list
** https://api.coingecko.com/api/v3/coins/refinable
** https://www.coingecko.com/api/documentations/v3#/coins/get_coins_markets
*/

/*
** getCoins
**
** return Array [
**   {
**     "id": "bakerytoken",
**     "symbol": "BAKE",
**     "name": "BakerySwap"
**   }, {
**     "id": "bitcoin",
**     "symbol": "BTC",
**     "name": "Bitcoin"
**   },...
** ]
*/
export async function getCoins (symbols) {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/list')
  const result = await response.json()
  if (result.error) {
    const e = result.error
    throw new Error(`${e.message}: ${e.text}`)
  }
  const coins = result
    .map(coin => ({ ...coin, symbol: coin.symbol.toUpperCase() }))
    .filter(coin => symbols.includes(coin.symbol))

  return coins
}

/*
** getTickersFromCoingecko
**
** return Array [
**   BAKE: { name: "BakerySwap", tickers: (17) […], slug: "bakerytoken" },
**   BTC: { name: "Bitcoin", tickers: (48) […], slug: "bitcoin" },...
** ]
*/
export async function getTickers (coins) {
  const url = '/api/coingecko/ticker'
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(coins) })
  const result = await response.json()
  console.log('getTickersFromCoingecko', result)
  if (result.error) {
    const e = result.error
    throw new Error(`${e.message}: ${e.text}`)
  }
  return result
}
