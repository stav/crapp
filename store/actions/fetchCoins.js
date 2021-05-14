/** fetchCoins
 **
 ** @var symbols Array [ "BNB", "BTC", "BUSD",… ]
 ** @var coins Array [ { "symbol":"BAKE", "id":"bakerytoken", "name":"BakerySwap" },… ]
 ** @var data Object { "BAKE": {"name":"BakerySwap", "tickers":[{"base":"BAKE", "target":"BNB", "exchange":"BINANCE"},…]}, … }
 **
 ** @returns String "Coin data loaded"
 */
export default async function fetchCoins ({ getters, commit }) {
  let symbols, coins, data
  try {
    symbols = getters.getSymbols
    coins = await getters.getCoins(symbols)
    data = await getters.getTickers(coins)
  } catch (e) {
    console.warn(`Error in fetchCoins: ${e.message}`)
    return e.message
  }
  console.log('fetchCoins', symbols, coins, data)

  for (const symbol in data) {
    const symbolData = data[symbol]
    symbolData.symbol = symbol
    commit('setCoinData', symbolData)
  }
  return 'Loaded coin data for ' + Object.keys(data)
}
