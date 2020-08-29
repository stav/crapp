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
}
