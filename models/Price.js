import { Model } from '@vuex-orm/core'
import Coin from './Coin'

export default class Price extends Model {
  static entity = 'prices'

  static fields () {
    return {
      id: this.uid(),
      symbol: this.string(''),
      price: this.number(0.0),
      coins: this.hasMany(Coin, 'priceId'),
    }
  }
}
