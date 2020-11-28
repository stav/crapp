import { Model } from '@vuex-orm/core'
// import Coin from './Coin'

const krakenDateStringRegex = /(?<M>\d{2})-(?<D>\d{2})-(?<Y>\d{2}) (?<h>\d{2}):(?<m>\d{2}):(?<s>\d{2}) \+\d{4}/
const blockfiDateStringRegex = /(?<Y>\d{4})-(?<M>\d{2})-(?<D>\d{2})/

/*
** parseDate
*/
function parseDate (dateString) {
  const result = krakenDateStringRegex.exec(dateString) || blockfiDateStringRegex.exec(dateString)
  return Object.assign({ h: 0, m: 0, s: 0 }, result.groups)
}

/*
** getTimestamp
**
** dateString == '11-26-20 18:26:44 +0000'
*/
function getTimestamp (dateString) {
  const { Y, M, D, h, m, s } = parseDate(dateString)
  const iY = parseInt(Y)
  const day = parseInt(D)
  const year = iY < 100 ? 2000 + iY : iY
  const month = parseInt(M) - 1
  const timestamp = Date.UTC(year, month, day, h, m, s)
  return timestamp
}

/*
** Transaction
**
** {
**   "id": "$uid22",
**   "date": "10-17-20 04:19:17 +0000",
**   "type": "deposit",
**   "repo": "Kraken",
**   "coinId": "$uid1",
**   "symbol": "BTC",
**   "currency": "₿ Bitcoin (XBT)",
**   "quantity": 0.17599,
**   "timestamp": 1602908357000,
**   "timestring": "Sat, 17 Oct 2020 04:19:17 GMT"
** }
*/
export default class Transaction extends Model {
  static entity = 'transactions'

  static fields () {
    return {
      id: this.uid(),
      date: this.string(''),
      type: this.string(''),
      repo: this.string(''),
      coinId: this.attr(null),
      symbol: this.string(''),
      currency: this.string(''),
      quantity: this.number(0.0),
      timestamp: this.number(0),
      timestring: this.string(''),
      // coin: this.belongsTo(Coin, 'coinId')
    }
  }

  static beforeCreate (model) {
    const timestamp = getTimestamp(model.date)
    const date = new Date(timestamp)
    model.timestamp = timestamp
    model.timestring = date.toUTCString()
  }
}
