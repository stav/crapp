import { Model } from '@vuex-orm/core'

/*
** Statement
**
*/
export default class Statement extends Model {
  static entity = 'statements'

  static fields () {
    return {
      id: this.uid(),
      repoId: this.attr(null),
      fee: this.attr({}),
      match: this.attr({}),
      deposit: this.attr({}),
      withdrawal: this.attr({}),
      timestamp: this.number(0),
      timestring: this.string(''),
    }
  }

  static beforeCreate (model) {
    const date = new Date(model.timestamp)
    model.timestring = date.toUTCString()
  }
}
