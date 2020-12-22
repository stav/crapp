import axios from 'axios'

/*
** Bitfinex API Server Middleware
**
** https://docs.bitfinex.com/docs/rest-public
*/
export default async function (req, res) {
  res.end(
    JSON.stringify(
      await resolve(
        config(req.url))))
}

/*
** API request helper to configure requests based on the URL
*/
function config (url) {
  const requests = []
  const _url = new URL('http://example.com' + url)

  // Configure the requests
  switch (_url.pathname) {
    // https://docs.bitfinex.com/reference#rest-public-candles
    case '/candles': {
      const timeframe = '1m' // '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'
      const section = 'hist' // 'hist', 'last'
      const symbol = _url.searchParams.get('symbol')
      const pair = symbol + 'USD'
      const params = {
        // limit: 3,
      }
      requests.push({
        key: 'candles',
        config: configRequest(`/candles/trade:${timeframe}:t${pair}/${section}`, params),
      })
      break
    }

    default:
      console.error(url)
  }
  return requests
}

/*
** API request helper to make the configured requests
*/
async function resolve (requests) {
  const data = { error: [] }
  for (const request of requests) {
    try {
      const response = await axios(request.config)
      data[request.key] = response.data
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
** API request helper for general endpoints
**
** See nuxt.config.js for privateRuntimeConfig
*/
function configRequest (path, params = {}) {
  // Send back the request configuration
  return {
    baseURL: 'https://api-pub.bitfinex.com/v2',
    url: path,
    method: 'GET',
    headers: {
    },
    params,
  }
}
