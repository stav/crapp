import axios from 'axios'

/*
** CoinMarketCap API Server Middleware
**
** https://pro.coinmarketcap.com/account
** https://coinmarketcap.com/api/documentation/v1/
*/
export default async function (req, res) {
  let data
  // Check to make sure we have the needed API KEY
  if (process.env.COINMARKETCAP_API_KEY) {
    data = postProcess(
      await resolveRequests(
        configRequests(req.url)))
  } else {
    const error = new Error('CoinMarketCap API KEY needed for this request')
    console.warn(error)
    data = { error: [error] }
  }

  if (data.error) {
    data.error = data.error.map(e => e.message).join(', ')
    res.statusMessage = data.error || 'Server error'
    res.statusCode = 422
  } else {
    res.statusCode = 200
  }
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

/*
** API request helper to massage the data
*/
function postProcess (data) {
  return data
}

/*
** API request helper to configure requests based on the URL
*/
function configRequests (url) {
  const _url = new URL('http://example.com' + url)
  const requests = []

  // Configure the requests
  switch (_url.pathname) {
    case '/quotes':
      requests.push({
        key: 'quotes',
        config: configRequest(
          '/v1/cryptocurrency/quotes/latest' + _url.search,
          { skip_invalid: true },
        ),
      })
      break

    default:
      console.error(url)
  }
  return requests
}

/*
** API request helper to make the configured requests
*/
async function resolveRequests (requests) {
  const data = {}
  for (const request of requests) {
    try {
      const response = await axios(request.config)
      data[request.key] = response.data
    } catch (error) {
      data.error = {}
      // data.error.stack = error.stack
      data.error.config = error.config
      data.error.datetime = error.response?.data.status.timestamp
      data.error.headers = error.response?.headers
      data.error.message = error.message
      data.error.status = error.response?.status
      data.error.statusText = error.response?.statusText
      data.error.text = error.response?.data.status.error_message
    }
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
  const config = {
    baseURL: 'https://pro-api.coinmarketcap.com',
    url: path,
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    },
    params,
  }
  return config
}
