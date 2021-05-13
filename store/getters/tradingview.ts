/**
 ** getTradingViewSymbol
 **
 ** @param symbol String "BTC"
 **
 ** @returns String format "Exchange:BaseTarget", e.g. "BITSTAMP:BTCUSD"
 */
export function getTradingViewSymbol (state: any, getters: any) {
  return (symbol: string) => {
    symbol = symbol || state.flyoutCoin?.symbol
    const ticker = getters.symbolTicker(symbol)
    if (ticker) {
      return `${ticker.exchange}:${ticker.base}${ticker.target}`
    }
  }
}
