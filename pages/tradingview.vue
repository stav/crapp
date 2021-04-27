<template>
  <!-- TradingView Widget BEGIN -->
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget" />
    <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/cryptocurrencies/prices-all/" rel="noopener" target="_blank"><span class="blue-text">Cryptocurrency Markets</span></a> by TradingView</div>
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js" async>
      {
      "width": "90%",
      "height": "90%",
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "isTransparent": true,
      "colorTheme": "dark",
      "locale": "en"
      }
    </script>
  </div>
  <!-- TradingView Widget END -->
</template>

<style lang="scss" scoped>
.tradingview-widget-container {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
