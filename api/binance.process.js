/*
** Binance API Post-resolution Processors
*/

function listPartialCommissions (partials) {
  return partials.map(p => ({ asset: p.commissionAsset, commission: p.commission }))
}

function avgPartialTime (partials) {
  return partials.reduce(
    (total, partial) => total + parseFloat(partial.time),
    0 // Initialize sum at zero
  ) / partials.length
}

function sumPartialQuantity (partials) {
  return partials.reduce(
    (total, partial) => total + parseFloat(partial.qty),
    0 // Initialize sum at zero
  )
}

function weightedPrice (partials) {
  return partials.reduce(
    (total, partial) => total + parseFloat(partial.qty) * parseFloat(partial.price),
    0 // Initialize sum at zero
  )
}

function weightedAveragePrice (partials) {
  return weightedPrice(partials) / sumPartialQuantity(partials)
}

export function tradesProcessor (data) {
  delete data.type
  const orders = []
  for (const pair in data) {
    const partials = {}
    // Group all partials by order id
    for (const partial of data[pair]) {
      if (partial.orderId in partials) {
        partials[partial.orderId].push(partial)
      } else {
        partials[partial.orderId] = [partial]
      }
    }
    // Aggregate partials into single orders
    for (const orderId in partials) {
      const pgroup = partials[orderId]
      const pairs = Array.from(new Set(pgroup.map(p => p.symbol)))
      const buyer = Array.from(new Set(pgroup.map(p => p.isBuyer)))
      const maker = Array.from(new Set(pgroup.map(p => p.isMaker)))
      orders.push({
        pair: pairs.length === 1 ? pairs[0] : pairs,
        time: parseInt(avgPartialTime(pgroup)),
        order: orderId,
        partials: pgroup.length,
        qty: sumPartialQuantity(pgroup),
        price: weightedAveragePrice(pgroup),
        commissions: listPartialCommissions(pgroup),
        buyer: buyer.length === 1 ? buyer[0] : buyer,
        maker: maker.length === 1 ? maker[0] : maker,
      })
    }
  }
  return orders
}
