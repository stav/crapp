/*
** tradingView actions
*/

export async function loadTradingviewExchanges (commit) {
  const url = '/api/tradingview/search/all'
  const pairs = [['ETH', 'USD'], ['CAKE', 'USDT']]
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(pairs) })
  const data = await response.json()

  for (const symbolPair in data) {
    const exchanges = data[symbolPair].map(entry => entry.exchange)
    commit('setSymbolExchanges', { symbolPair, exchanges })

    const symbol = data[symbolPair][0].symbols[0] // If the api used "recourse" then instead of data[symbolPair][0] we could use data[symbolPair]
    const exchange = data[symbolPair][0].exchange
    commit('setTradingviewSymbol', { symbol, string: `${exchange}:${symbolPair}` })
  }
}
