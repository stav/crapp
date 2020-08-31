import { Model } from '@vuex-orm/core'
import Coin from './Coin'

export default class Repository extends Model {
  static entity = 'repositorys'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string('[no-name]'),
      active: this.boolean(true),
      coins: this.hasMany(Coin, 'repoId'),
    }
  }

  // static beforeUpdate (model) {
  //   for (const coin of model.coins) {
  //     coin.name = coin.symbol
  //     const field = coin.symbol.toLowerCase() + 'Coin'
  //     repository[field] = coin.quantity
  //     console.log('model update', model)
  //   }
  // }
}
