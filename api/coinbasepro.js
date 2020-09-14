import { Buffer } from 'buffer'
import crypto from 'crypto'
import axios from 'axios'

/*
** Coinbase API Middleware
**
** See nuxt.config.js for privateRuntimeConfig
** https://nuxtjs.org/guides/configuration-glossary/configuration-servermiddleware
*/
export default async function (req, res) {
  // First: Create the URL
  const url = new URL('https://api.pro.coinbase.com/')
  url.pathname = req.url
  url.searchParams.append('limit', 100)

  // Second: Create the signature from the URL
  const timestamp = Math.floor(Date.now() / 1000)
  const method = 'GET'
  const path = url.pathname + url.search
  const body = ''
  const message = timestamp + method + path + body
  const secretDecoded = Buffer.from(process.env.COINBASEPRO_API_SECRET, 'base64')
  const signature = crypto.createHmac('sha256', secretDecoded).update(message).digest('base64')

  // Third: Config the request
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
      'CB-ACCESS-KEY': process.env.COINBASEPRO_API_KEY,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-PASSPHRASE': process.env.COINBASEPRO_API_PASSPHRASE,
    },
  }

  // Fourth: Make the reqeuest
  let data = []
  try {
    const response = await axios(config)
    data = response.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.status)
      console.log(error.response.data)
      console.log(error.response.headers)
      console.log(error)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.response.message)
      console.log(error)
    }
  }

  // Fifth: Send the response
  res.end(JSON.stringify(data))
}
