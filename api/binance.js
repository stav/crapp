import crypto from 'crypto'
import axios from 'axios'

/*
** Binance API Server Middleware
**
** https://binance-docs.github.io/apidocs/spot/en/#general-info
** https://nuxtjs.org/guides/configuration-glossary/configuration-servermiddleware
*/
// eslint-disable-next-line require-await
export default async function (req, res) {
  req.body = ''
  req.on('data', (chunk) => { req.body += chunk.toString() })
  req.on('end', async () => { await binance(req, res) })
}

async function binance (req, res) {
  // Configure the requests
  const recourse = configRequests(req)

  // Make the requests
  let data = await resolveRequests(recourse)

  // Process the data
  data = postProcess(data)

  // Send the response to the client
  if (data.error) {
    const error = data.error.map(e => e.message).join(', ')
    res.statusMessage = error || 'Server error'
    res.statusCode = 422
  } else {
    res.statusCode = 200
  }
  res.end(JSON.stringify(data))
}

/*
** API request helper to configure requests based on the URL
*/
function configRequests (req) {
  let type
  const requests = []
  const url = new URL('http://example.com' + req.url)
  console.log('api/binance/configRequests', url, typeof req.body, req.body)

  // Configure the requests
  switch (url.pathname) {
    case '/balances':
      type = 'balances'
      requests.push({ key: 'balances', config: configSignedRequest('/api/v3/account') })
      break

    case '/account':
      requests.push({ key: 'account', config: configSignedRequest('/api/v3/account') })
      requests.push({ key: 'trading', config: configSignedRequest('/wapi/v3/apiTradingStatus.html') })
      requests.push({ key: 'status', config: configSignedRequest('/wapi/v3/accountStatus.html') })
      break

    case '/system.status':
      requests.push({ key: '_', config: configRequest('/wapi/v3/systemStatus.html') })
      break

    case '/time':
      requests.push({ key: '_', config: configRequest('/api/v3/time') })
      break

    case '/coins':
      requests.push({ key: '_', config: configSignedRequest('/sapi/v1/capital/config/getall') })
      break

    case '/deposit.history':
      requests.push({ key: 'deposits', config: configSignedRequest('/wapi/v3/depositHistory.html') })
      requests.push({ key: 'support', config: configSignedRequest('/sapi/v1/capital/deposit/hisrec') })
      break

    case '/prices':
      requests.push({ key: 'prices', config: configRequest('/api/v3/ticker/price') })
      break

    case '/price': {
      const symbol = url.searchParams.has('asset') ? url.searchParams.get('asset') + 'USDT' : null
      requests.push({ key: 'data', config: configRequest('/api/v3/ticker/price', { symbol }) })
      break
    }

    case '/trades': {
      type = 'trades'
      const pairs = req.method === 'POST' ? JSON.parse(req.body).pairs : []
      for (const pair of pairs) {
        requests.push({
          key: pair,
          config: configSignedRequest('/api/v3/myTrades', { symbol: pair, recvWindow: 15000 }),
        })
      }
      break
    }

    default:
      console.error(url)
  }
  return { type, requests }
}

/*
** API request helper to make the configured requests
*/
async function resolveRequests (recourse) {
  const data = { type: recourse.type, error: [] }
  for (const request of recourse.requests) {
    console.log('api.binance resolveRequests', request)
    try {
      const response = await axios(request.config)
      data[request.key] = response.data
    } catch (error) {
      if (error.response?.data?.msg) {
        error.response.data.request = request.config
        data.error.push(error.response.data)
      } else {
        data.error.push(error)
      }
    }
  }
  if (data.error.length === 0) {
    delete data.error
  }
  return data
}

/*
** API request helper to massage the data
*/
function postProcess (data) {
  console.log('api.binance postProcess 1:', data)
  // If we are processing a balances request then just pull out the balances
  if (data.type === 'balances') {
    return {
      balances:
        (data.balances.balances || [])
          .map(balance => ({
            asset: balance.asset,
            free: parseFloat(balance.free),
            locked: parseFloat(balance.locked),
          }))
          .filter(balance => balance.free || balance.locked)
    }
  }
  if (data.type === 'trades') {
    console.log('api.binance postProcess 2:', data)
    delete data.type
    return data
  }
  // Otherwise just return the data untouched
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
    baseURL: 'https://api.binance.com',
    url: path,
    method: 'GET',
    headers: {
      'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    },
    params,
  }
}

/*
** API request helper for a signed endpoint
**
** See nuxt.config.js for privateRuntimeConfig
*/
function configSignedRequest (path, params = {}) {
  // Create the URL
  const url = new URL('https://api.binance.com/')
  url.pathname = path
  url.searchParams.append('timestamp', Date.now())
  for (const param in params) {
    url.searchParams.append(param, params[param])
  }
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
