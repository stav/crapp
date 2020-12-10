import { Model } from '@vuex-orm/core'

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
      fee: this.number(0.0),
      date: this.string(''),
      type: this.string(''),
      note: this.string(''),
      repoId: this.attr(null),
      coinId: this.attr(null),
      symbol: this.string(''),
      currency: this.string(''),
      quantity: this.number(0.0),
      timestamp: this.number(0),
      timestring: this.string(''),
    }
  }

  static beforeCreate (model) {
    const date = new Date(model.timestamp)
    model.timestring = date.toUTCString()
  }
}
