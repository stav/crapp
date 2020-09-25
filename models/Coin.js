import { Model } from '@vuex-orm/core'

export default class Coin extends Model {
  static entity = 'coins'

  static fields () {
    return {
      id: this.uid(),
      name: this.string(''),
      price: this.number(0.0),
      symbol: this.string(''),
    }
  }

  static beforeCreate (model) {
    model.name = model.name || model.symbol
  }
}
