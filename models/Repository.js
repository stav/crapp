import { Model } from '@vuex-orm/core'
import RepoCoin from './RepoCoin'

export default class Repository extends Model {
  static entity = 'repositorys'

  static fields () {
    return {
      id: this.uid(),
      name: this.string('[no-name]'),
      active: this.boolean(true),
      coins: this.hasMany(RepoCoin, 'repoId'),
    }
  }
}
