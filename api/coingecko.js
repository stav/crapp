import axios from 'axios'

/*
** CoinGecko API Server Middleware
**
** Response body is received and assembled in chunks on each 'data' event.
**
** Calls 'main()' on 'end' event.
**
** sparklines:
**   https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=bitcoin&sparkline=true
** https://github.com/coingecko/cryptoformat
** https://www.coingecko.com/en/faq
** https://www.coinapi.io/
**
** TODO: request throlling
*/
// eslint-disable-next-line require-await
export default async function (req, res) {
  req.body = ''
  req.on('data', (chunk) => { req.body += chunk.toString() })
  req.on('end', async () => { await main(req, res) })
}

/*
** main
**
** Request -> config -> resolve -> Response
*/
async function main (req, res) {
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

    case '/ticker': {
      const coins = JSON.parse(request.body)
      for (const coin of coins) {
        requests.push({
          key: coin.symbol,
          slug: coin.id,
          name: 'tickers',
          config: configRequest(`coins/${coin.id}/tickers/`),
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
** configRequest
**
** API request helper for un-authenticated endpoints
*/
function configRequest (path, params = {}) {
  return {
    baseURL: 'https://api.coingecko.com/api/v3/',
    url: path,
    method: 'GET',
    params,
    headers: {
    },
  }
}

/*
** resolve
**
** API request helper to make the configured requests
**
** Uses 'process()' function for each request/response.
*/
async function resolve (requests) {
  const data = { error: [] }
  for (const request of requests) {
    console.log('coingecko api request', request)
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
*/
function process (request, response) {
  switch (request.name) {
    case 'tickers': {
      // Add individual request slug to response data
      response.data = { ...response.data, slug: request.slug }
      break
    }
  }
  return response.data
}
