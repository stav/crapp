/*
** coingecko
**
** https://api.coingecko.com/api/v3/coins?per_page=250&page=1
** https://api.coingecko.com/api/v3/coins/list
** https://api.coingecko.com/api/v3/coins/refinable
** https://www.coingecko.com/api/documentations/v3#/coins/get_coins_markets
*/

declare const fetch: Function

/**
 ** getAllCoins
 **
 ** @returns Array (7000+) [
 **   { "symbol": "BAKE", "id": "bakerytoken", "name": "BakerySwap" },
 **   { "symbol": "BTC", "id": "bitcoin", "name": "Bitcoin" },…
 ** ]
 */
export function getAllCoins (state: any) {
  return async () => {
    // If the full coin list is already in the store then just return that
    if (state.fullCoinList.length > 0) {
      // Return non-reactive list
      const fullCoinList = []
      for (const coin of state.fullCoinList) {
        fullCoinList.push({ ...coin })
      }
      return fullCoinList
    }

    // Otherwise go to CoinGecko and get the list
    console.info('Fetching new full coin list from CoinGecko')
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list')
    const coins = await response.json()
    if (coins.error) {
      const e = coins.error
      throw new Error(`${e.message}: ${e.text}`)
    }
    // Make sure symbol is uppercase
    return coins.map((coin: any) => ({ ...coin, symbol: coin.symbol.toUpperCase() }))
  }
}

/**
 ** getCoins
 **
 ** @param symbols Array [ "ADA", "BTC", "ETH" ]
 **
 ** @returns Array [
 **   { "symbol": "BAKE", "id": "bakerytoken", "name": "BakerySwap" },
 **   { "symbol": "BTC", "id": "bitcoin", "name": "Bitcoin" },…
 ** ]
 */
export function getCoins (_state: any, getters: any) {
  return async (symbols: string[]) => {
    // Get the fill coins list
    let coins: any[] = await getters.getAllCoins()
    // Filter the full list down to those provided in `symbols`
    coins = Array.from(coins).filter((coin: any) => symbols.includes(coin.symbol))
    // TODO Somehow we need to check for multiples of the same symbol, ex UNI
    // if (coins.length) {
    //   console.warn(`getCoins found ${coins.length} coins for symbol ${}`, coins)
    // }
    return coins
  }
}

/**
 ** getTickers
 **
 ** @param coins Array [ BTC: { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },… ]
 **
 ** result { name: "Bitcoin", tickers: [{ base: "BTC", target: "USDT", last: 50830.99,… },…] }
 **
 ** return { RAY: { name: "Raydium", tickers: { base: "RAY", target: "USD", exchange: "FTX" },… } }
 */
function addExchange(ticker:any) {
  const exchange = ticker.market.identifier.toUpperCase()
    .replace('FATBTC', 'HITBTC')
    .replace(/FTX_.+/, 'FTX')
  return {
    ...ticker,
    exchange,
    // base: ticker.base,
    // target: ticker.target,
  }
}
function filterExchange(ticker:any) {
  const badExchanges = [
    'BIKI',
    'BINANCE_US',
    'BITMAX',
    'BKEX',
    'CRYPTO_COM',
    'DIGIFINEX',
    'GATE',
    'GDAX',
    'HOO',
    'MXC',
    'P2PB2B',
    'PROBIT',
    'RAYDIUM',
    'SERUM_DEX',
    'WHITEBIT',
  ]
  return !badExchanges.includes(ticker.exchange)
}
export function getTickers (state:any) {
  return async (coins:any[]) => {
    const coinTickers:any = {}

    for (const coin of coins) {
      const url = `https://api.coingecko.com/api/v3/coins/${coin.id}/tickers/`
      const response = await fetch(url)
      const result = await response.json()
      const tickers = result.tickers .map(addExchange) .filter(filterExchange)
      coinTickers[coin.symbol] = { ...result, tickers }
    }
    return coinTickers
  }
}

// /*
// ** getTickersFromAPI
// */
// export function getTickersFromAPI (state:any) {
//   return async (coins:any) => {
//     const url = '/api/coingecko/ticker'
//     const response = await fetch(url, { method: 'POST', body: JSON.stringify(coins) })
//     const result = await response.json()
//     console.log('getTickersFromAPI', result)
//     if (result.error) {
//       const e = result.error
//       throw new Error(`${e.message}: ${e.text}`)
//     }
//     return result
//   }
// }

/**
 ** symbolTicker
 **
 ** @param symbol String "BTC"
 **
 ** @returns Object { "base": "BTC", "target": "USDC", "exchange": "BINANCE",… }
 */
export function symbolTicker (state: any) {
  return (symbol: string) => {
    // Find the coin in the db
    const coin = state.Coin.find((c: any) => c.symbol === symbol)
    // We should already have the tickers cached by `cacheTickers`
    if (coin.tickers) {
      const target = 'USD'
      // Find the first ticker that is "like" the target: ex target is "USD": USD, USDC, BUSD, etc
      const ticker = coin.tickers.find((t: any) => (t.base === symbol && t.target.includes(target)))
      return ticker
    }
  }
}
