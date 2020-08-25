import crypto from 'crypto'
import axios from 'axios'

export default {
  // path: '/api/coinbase',

  /*
  ** Coinbase API Middleware
  **
  ** https://nuxtjs.org/guide/runtime-config
  ** https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config#using-your-config-values
  **
  ** See nuxt.config.js for privateRuntimeConfig
  ** \/ Can't figure out how to get the Nuxt context in a middleware
  ** ^^ context.$config.apiSecret is what we want
  */
  async handler(req, res, next) {
    console.log('middleware', req.url)

    // First create the URL
    const url = new URL('https://api.coinbase.com/')
    // url.pathname = '/v2/accounts'
    // url.pathname = '/v2/accounts/ab2ae1c9-1092-5905-a05a-2eaf92c66432/transactions'
    url.pathname = req.url
    url.searchParams.append('limit', 100)

    // Second create the signature from the URL
    const timestamp = Math.floor(Date.now() / 1000)
    const method = 'GET'
    const path = url.pathname + url.search
    const body = ''
    const message = timestamp + method + path + body;
    const signature = crypto.createHmac("sha256", process.env.APISECRET).update(message).digest("hex");
    console.log('secret', process.env.APISECRET, message, signature);

    // Third config the request
    const config = {
      // `baseURL` will be prepended to `url` unless `url` is absolute.
      // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
      // to methods of that instance.
      baseURL: url.origin,

      // `url` is the server URL that will be used for the request
      url: path,

      // `method` is the request method to be used when making the request
      // method: 'get', // default
      method,

      // `headers` are custom headers to be sent
      headers: {
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-KEY': process.env.APIKEY,
        'CB-VERSION': '2015-07-22',
      },
    }

    // Fourth Make the reqeuest
    const response = await axios(config)

    // Send the response
    res.end(JSON.stringify(response.data))
  }
}
