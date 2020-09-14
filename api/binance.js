import crypto from 'crypto'
import axios from 'axios'

/*
** Binance API Server Middleware
**
** https://binance-docs.github.io/apidocs/spot/en/#general-info
** https://nuxtjs.org/guides/configuration-glossary/configuration-servermiddleware
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
  // If we are processing a balances request then just pull out the balances
  if ('balances' in data) {
    return {
      balances:
        (data?.balances?.balances || []) // Optional Chaining https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
          .map(balance => ({
            asset: balance.asset,
            free: parseFloat(balance.free),
            locked: parseFloat(balance.locked),
          }))
          .filter(balance => balance.free || balance.locked)
    }
  }
  // Otherwise just return the data untouched
  return data
}

/*
** API request helper to configure requests based on the URL
*/
function configRequests (url) {
  const requests = []
  const urlParts = url.split('/')
  let symbol
  if (urlParts.length > 2) {
    const asset = urlParts[2]
    symbol = asset + 'USDT'
  }

  // Configure the requests
  switch (urlParts[1]) {
    case 'balances':
      requests.push({ key: 'balances', config: configSignedRequest('/api/v3/account') })
      break

    case 'account':
      requests.push({ key: 'account', config: configSignedRequest('/api/v3/account') })
      requests.push({ key: 'trading', config: configSignedRequest('/wapi/v3/apiTradingStatus.html') })
      requests.push({ key: 'status', config: configSignedRequest('/wapi/v3/accountStatus.html') })
      break

    case 'system.status':
      requests.push({ key: '_', config: configRequest('/wapi/v3/systemStatus.html') })
      break

    case 'time':
      requests.push({ key: '_', config: configRequest('/api/v3/time') })
      break

    case 'coins':
      requests.push({ key: '_', config: configSignedRequest('/sapi/v1/capital/config/getall') })
      break

    case 'deposit.history':
      requests.push({ key: 'deposits', config: configSignedRequest('/wapi/v3/depositHistory.html') })
      requests.push({ key: 'support', config: configSignedRequest('/sapi/v1/capital/deposit/hisrec') })
      break

    case 'prices':
      requests.push({ key: 'prices', config: configRequest('/api/v3/ticker/price') })
      break

    case 'price':
      requests.push({ key: 'data', config: configRequest('/api/v3/ticker/price', { symbol }) })
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
