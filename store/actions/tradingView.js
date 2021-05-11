/*
** tradingView actions
*/

export async function loadTradingviewExchanges (commit) {
  const url = '/api/tradingview/search/all'
  const pairs = [['BAKE', 'USD'], ['BAKE', 'USDT']]
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(pairs) })
  const data = await response.json()
  console.log('loadTradingviewExchanges', data)

  for (const symbolPair in data) {
    const exchanges = data[symbolPair].map(entry => entry.exchange)
    console.log('loadTradingviewExchanges committing setSymbolExchanges', symbolPair, exchanges)
    commit('setSymbolExchanges', { symbolPair, exchanges })

    const exchange = data[symbolPair][0].exchange
    const string = `${exchange}:${symbolPair}`
    const symbol = data[symbolPair][0].symbols[0] // If the api used "recourse" then instead of data[symbolPair][0] we could use data[symbolPair]
    console.log('loadTradingviewExchanges committing setTradingviewSymbol', symbol, string)
    commit('setTradingviewSymbol', { symbol, string })
  }
}
