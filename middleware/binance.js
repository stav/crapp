import crypto from 'crypto'
import axios from 'axios'

export default {
  // path: '/api/binance',

  /*
  ** Binance API Middleware
  **
  ** https://binance-docs.github.io/apidocs/spot/en/#general-info
  */
  async handler (req, res) {
    let configs = []

    // Configure the request
    switch (req.url) {
      case '/account':
        configs.push(configSignedRequest('/api/v3/account'))
        break

      case '/system.status':
        configs.push(configRequest('/wapi/v3/systemStatus.html'))
        break

      case '/time':
        configs.push(configRequest('/api/v3/time'))
        break

      case '/coins':
        configs.push(configSignedRequest('/sapi/v1/capital/config/getall'))
        break

      case '/deposit.history':
        configs.push(configSignedRequest('/wapi/v3/depositHistory.html'))
        configs.push(configSignedRequest('/sapi/v1/capital/deposit/hisrec'))
        break

      default:
        break
    }

    // Make the reqeuest
    let data = []
    for (const config of configs) {
      try {
        const response = await axios(config)
        data.push(response.data)
      } catch (error) {
        data.push({ error })
      }
    }

    // Send the response
    res.end(JSON.stringify(data))
  }
}

/*
** API request helper for general endpoints
**
** See nuxt.config.js for privateRuntimeConfig
*/
function configRequest (path) {
  // Send back the request configuration
  return {
    baseURL: 'https://api.binance.com',
    url: path,
    method: 'GET',
    headers: {
      'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    },
  }
}

/*
** API request helper for a signed endpoint
**
** See nuxt.config.js for privateRuntimeConfig
*/
function configSignedRequest (path) {
  // Create the URL
  const url = new URL('https://api.binance.com/')
  url.pathname = path
  url.searchParams.append('timestamp', Date.now())
  // url.searchParams.append('recvWindow', 5000)
  const search = url.search.slice(1)

  // Create the signature hash from the URL using the secret
  const signature = crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET)
    .update(search)
    .digest('hex')
  // var signature, hmac;
  // hmac = crypto.createHmac('sha256', process.env.BINANCE_API_SECRET);
  // hmac.write(search); // write in to the stream
  // hmac.end();       // can't read from the stream until you call end()
  // signature = hmac.read().toString('hex');    // read out hmac digest
  url.searchParams.append('signature', signature)

  // Send back the request configuration
  return {
    baseURL: url.origin,
    url: url.pathname + url.search,
    method: 'GET',
    headers: {
      'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    },
  }
}
