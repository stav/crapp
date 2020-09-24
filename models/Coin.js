import { Model } from '@vuex-orm/core'

export default class Coin extends Model {
  static entity = 'coins'

  static fields () {
    return {
      id: this.uid(),
      repoId: this.attr(null),
      symbol: this.string(''),
      name: this.string(''),
      quantity: this.number(0.0),
      priceId: this.attr(null),
    }
  }

  static beforeCreate (model) {
    model.name = model.name || model.symbol
  }
}
