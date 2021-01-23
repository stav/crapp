import { Model } from '@vuex-orm/core'
import Transaction from './Transaction'
import RepoCoin from './RepoCoin'

/*
** Repository
*/
export default class Repository extends Model {
  static entity = 'repositorys'

  static fields () {
    return {
      id: this.uid(),
      name: this.string('[no-name]'),
      slug: this.string(),
      coins: this.hasMany(RepoCoin, 'repoId'),
      trans: this.hasMany(Transaction, 'repoId'),
      active: this.boolean(true),
    }
  }

  static beforeCreate (model) {
    model.slug = model.slug || model.name.split(/\s/)[0].toLowerCase()
  }
}
