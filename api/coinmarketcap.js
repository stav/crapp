import axios from 'axios'
import url from 'url'

/*
** Coin Market Cap API Server Middleware
**
** https://coinmarketcap.com/api/documentation/v1/
*/
export default async function (req, res) {
  // Configure the requests
  const requests = configRequests(req.url)

  // Make the reqeuest to the host(s)
  let data = await resolveRequests(requests)

  // Process the data
  data = postProcess(data)

  // Send the response to the client
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
function configRequests (request_url) {
  const _url = new URL('http://example.com' + request_url)
  // const _url =
  url.parse('http://example.com' + request_url)
  const requests = []

  // Configure the requests
  switch (_url.pathname) {
    case '/quotes':
      requests.push({
        key: 'quotes',
        config: configRequest(
          '/v1/cryptocurrency/quotes/latest' + _url.search
          // { symbol: 'BTC', search: _url.search }
        )
      })
      break

      default:
        console.error(request.url)
  }
  return requests
}

/*
** API request helper to make the configured requests
*/
async function resolveRequests (requests) {
  const data = { error: [] }
  for (const request of requests) {
    try {
      const response = await axios(request.config)
      data[request.key] = response.data
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        data.error.push(error.response.status);
        data.error.push(error.response.data);
        data.error.push(error.response.headers);
        data.error.push(error);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        data.error.push(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        data.error.push(error.response.message);
        data.error.push(error);
      }
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
