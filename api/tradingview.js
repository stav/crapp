import axios from 'axios'

/*
** TradingView API Server Middleware
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
    case '/search': {
      const params = {
        hl: true,
        text: _url.searchParams.get('pair'),
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
    baseURL: 'https://symbol-search.tradingview.com/',
    url: path,
    method: 'GET',
    headers: {
    },
    params,
  }
}
