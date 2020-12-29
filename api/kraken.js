import { Buffer } from 'buffer'
import crypto from 'crypto'
import axios from 'axios'
import qs from 'qs'

/*
** Kraken API Server Middleware
**
** https://www.kraken.com/features/api#general-usage
**
** HTTP header:
**
**     API-Key = API key
**     API-Sign = Message signature using HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
**
** POST data:
**
**     nonce = always increasing unsigned 64 bit integer
**     otp = two-factor password (if two-factor enabled, otherwise not required)
**
** Responses are JSON encoded in the form of:
**
**     error = array of error messages in the format of:
**         <char-severity code><string-error category>:<string-error type>[:<string-extra info>]
**         severity code can be E for error or W for warning
**     result = result of API call (may not be present if errors occur)
**
** Note: Care should be taken when handling any numbers represented as strings, as these may overflow standard data types.
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

    case '/balance':
      requests.push({ key: 'balance', config: configSignedRequest('/0/private/Balance') })
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
      console.log('kraken resolve', response.config, response.request._header, response.data)
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
** API request helper for public endpoints
*/
function configRequest (path, params = {}) {
  // Send back the request configuration
  return {
    baseURL: 'https://api.kraken.com',
    url: path,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Axios) CrApp',
    },
    params,
  }
}

function getMessageSignature (path, request, secret, nonce) {
  const message = qs.stringify(request)
  const secretBuffer = Buffer.from(secret, 'base64')
  const hash = new crypto.createHash('sha256')
  const hmac = new crypto.createHmac('sha512', secretBuffer)
  const hash_digest = hash.update(nonce + message).digest('binary')
  const hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64')
  return hmac_digest
}

/*
** API request helper for private endpoints
*/
function configSignedRequest (path, params = {}) {
  const nonce = Date.now().toString()
  const signature = getMessageSignature(
    path,
    params,
    process.env.KRAKEN_PRIVATE_KEY,
    nonce,
  )
  // Send back the request configuration
  return {
    baseURL: 'https://api.kraken.com',
    url: path,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Axios) CrApp',
      'API-Key': process.env.KRAKEN_API_KEY,
      'API-Sign': signature,
    },
    params,
    data: 'nonce=' + nonce,
  }
}
