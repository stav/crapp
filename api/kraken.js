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
        config(
          req.url))))
}

/*
** API request helper to configure requests based on the URL
*/
function config (url) {
  const requests = []
  const urlParts = url.split('/')

  // Configure the requests
  switch (urlParts[1]) {
    case 'assets':
      requests.push({ key: 'assets', config: configRequest('/0/public/Assets') })
      break

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
    baseURL: 'https://api.kraken.com',
    url: path,
    method: 'GET',
    headers: {
      // 'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    },
    params,
  }
}
