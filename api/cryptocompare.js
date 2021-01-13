import axios from 'axios'

/*
** CryptoCompare API Server Middleware
**
** https://min-api.cryptocompare.com/documentation
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
    // https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsPriceEndpoint
    case '/prices': {
      const symbols = _url.searchParams.get('symbols')
      const params = {
        fsyms: symbols,
        tsyms: 'USD',
        extraParams: 'CrApp',
      }
      requests.push({
        key: 'prices',
        config: configRequest('/data/pricemulti', params),
      })
      break
    }

    // https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
    case '/history': {
      const symbol = _url.searchParams.get('symbol')
      const params = {
        fsym: symbol,
        tsym: 'USD',
        limit: 2000,
        extraParams: 'CrApp',
      }
      requests.push({
        key: 'history',
        config: configRequest('/data/v2/histoday', params),
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
      if (response.data.Response === 'Error') {
        console.error('cryptocompare resolve', response.data)
        data.error.push(response.data.Message)
      } else {
        data[request.key] = response.data
      }
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
    baseURL: 'https://min-api.cryptocompare.com',
    url: path,
    method: 'GET',
    headers: {
    },
    params,
  }
}
