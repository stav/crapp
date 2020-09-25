import { Model } from '@vuex-orm/core'
import Coin from './Coin'

export default class RepoCoin extends Model {
  static entity = 'repocoins'

  static fields () {
    return {
      id: this.uid(),
      coinId: this.attr(null),
      repoId: this.attr(null),
      quantity: this.number(0.0),
      coin: this.belongsTo(Coin, 'coinId')
    }
  }

  static beforeCreate (model) {
    model.name = model.name || model.symbol
  }
}
