import { Model } from '@vuex-orm/core'

export default class Coin extends Model {
  static entity = 'coins'

  static fields () {
    return {
      id: this.attr(null),
      repoId: this.attr(null),
      symbol: this.string(''),
      name: this.string(''),
    }
  }

  static beforeCreate (model) {
    // console.log('Coin create', model)
    model.name = model.name || model.symbol
  }
}
