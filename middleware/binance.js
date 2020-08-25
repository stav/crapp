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
    let config

    // Configure the request
    if (req.url.endsWith('account')) {
      config = configAccountRequest(req)
    } else {
      config = configRequest(req)
    }

    // Make the reqeuest
    let data
    try {
      const response = await axios(config)
      data = response.data
    } catch (error) {
      data = { error }
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
function configRequest (req) {
  // Send back the request configuration
  return {
    baseURL: 'https://api.binance.com',
    url: req.url,
    method: 'GET',
    headers: {
      'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    },
  }
}

/*
** API request helper for account information endpoint
**
** See nuxt.config.js for privateRuntimeConfig
*/
function configAccountRequest (req) {
  // Create the URL
  const url = new URL('https://api.binance.com/')
  url.pathname = req.url
  url.searchParams.append('timestamp', Math.floor(Date.now()))
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
