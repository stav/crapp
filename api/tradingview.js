import axios from 'axios'

/*
** TradingView API Server Middleware
**
** Response body is received and assembled in chunks on each 'data' event.
**
** Calls 'tradingView()' on 'end' event.
*/
// eslint-disable-next-line require-await
export default async function (req, res) {
  req.body = ''
  req.on('data', (chunk) => { req.body += chunk.toString() })
  req.on('end', async () => { await tradingView(req, res) })
}

/*
** tradingView
**
** Request -> config -> resolve -> Response
*/
async function tradingView (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify(
      await resolve(
        config(req))))
}

/*
** config
**
** API request generator to configure requests based on the URL
*/
function config (request) {
  const requests = []
  const url = new URL('http://example.com' + request.url)

  // eslint-disable-next-line padded-blocks
  switch (url.pathname) {

    case '/search': {
      const params = {
        hl: true,
        text: url.searchParams.get('pair'),
        lang: 'en',
        type: 'crypto',
        domain: 'production',
      }
      requests.push({
        key: 'search',
        config: configRequest('symbol_search/', params),
      })
      break
    }

    case '/search/all': {
      const symbolpairs = JSON.parse(request.body)
      for (const symbols of symbolpairs) {
        const pair = symbols.join('')
        const params = {
          hl: true,
          text: pair,
          lang: 'en',
          type: 'crypto',
          domain: 'production',
        }
        requests.push({
          name: 'searchall',
          key: pair,
          symbols,
          config: configRequest('symbol_search/', params),
        })
      }
      break
    }

    default:
      console.error(request.url)
  }
  return requests
}

/*
** resolve
**
** API request helper to make the configured requests
**
** Uses 'process()' function for each request/response.
**
**   requests = [ {
**     name: 'searchall',
**     key: 'BTCUSD',
**     symbols: [
**       'BTC',
**       'USD'
**     ],
**     config: {
**       baseURL: 'https://symbol-search.tradingview.com/',
**       url: 'symbol_search/',
**       method: 'GET',
**       headers: {},
**       params: [Object]
**     }
**   }, ...]
*/
async function resolve (requests) {
  const data = { error: [] }
  for (const request of requests) {
    try {
      const response = await axios(request.config)
      data[request.key] = process(request, response)
    } catch (error) {
      data.error.push(error)
    }
  }
  if (data.error.length === 0) {
    delete data.error
  }
  return data
}

/*
** process
**
** API individual response processor
**
** searchall:
**
**     { symbol: '<em>BTCUSD</em>T',
**       description: 'Bitcoin / USD Tether',
**       type: 'crypto',
**       exchange: 'FTX',
**       provider_id: 'ftx',
**  ->   symbols: [ 'BTC', 'USD' ] },
*/
function process (request, response) {
  if (request.name === 'searchall') {
    // Add individual request symbols to response data
    response.data = response.data.map(d => ({ ...d, symbols: request.symbols }))
  }
  return response.data
}

/*
** configRequest
**
** API request helper for general endpoints
**
** path = 'symbol_search/'
**
** params = {
**   hl: true,
**   text: 'BTCUSD',
**   lang: 'en',
**   type: 'crypto',
**   domain: 'production'
** }
*/
function configRequest (path, params = {}) {
  // Send back the request configuration
  return {
    baseURL: 'https://symbol-search.tradingview.com/',
    url: path,
    method: 'GET',
    headers: {
    },
    params,
  }
}
