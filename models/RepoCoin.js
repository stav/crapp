import { Model } from '@vuex-orm/core'
import Coin from './Coin'

export default class RepoCoin extends Model {
  static entity = 'repocoins'

  static fields () {
    return {
      id: this.uid(),
      coinId: this.attr(null),
      repoId: this.attr(null),
      coin: this.belongsTo(Coin, 'coinId'),
      qtyFree: this.number(0.0),
      qtyLocked: this.number(0.0),
    }
  }
}
