import axios from 'axios'

/*
** Kraken API Server Middleware
**
** https://www.kraken.com/features/api#public-market-data
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
    case '/assets':
      requests.push({ key: 'assets', config: configRequest('/0/public/Assets') })
      break

    // https://www.kraken.com/features/api#get-ohlc-data
    case '/history': {
      const params = {
        pair: _url.searchParams.get('symbol') + 'USD',
        interval: _url.searchParams.get('interval'),
      }
      requests.push({ key: 'history', config: configRequest('/0/public/OHLC', params) })
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
*/
function configRequest (path, params = {}) {
  // Send back the request configuration
  return {
    baseURL: 'https://api.kraken.com',
    url: path,
    method: 'GET',
    headers: {
    },
    params,
  }
}
