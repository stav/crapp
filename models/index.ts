import { v4 as uuidv4 } from 'uuid'

interface IRepository {
  id: string
  name: string
  slug: string
  pairs: string[]
  coins: object[]
  active: boolean
}

interface ICoin {
  id: string
  name: string
  slug: string
  symbol: string
  price: number
}

export class Repository implements IRepository {

  id = uuidv4()
  name = ''
  slug = ''
  pairs: string[] = []
  coins = []
  active = true

  constructor (options: IRepository) {
    Object.assign(this, {
      slug: options.name.toLowerCase().replace(/\s/g, '-').replace(/[.()]/g, ''),
    }, options)
    this.pairs = this.pairs || []
    this.coins = this.coins || []
  }

  // constructor (
  //   name: string,
  //   slug: string,
  //   pairs: string[],
  //   coins: object[],
  //   active: boolean,
  // ) {
  //   console.log('constuctor', name)
  //   this.name = name
  //   this.slug = slug || name.toLowerCase().replace(/\s/g, '-').replace(/[.()]/g, ''),
  //   this.pairs = pairs
  // }

}

export class Coin implements ICoin {

  id = uuidv4()
  name = ''
  slug = ''
  symbol = ''
  price = 0.0

  constructor (options: ICoin) {
    Object.assign(this, {
      name: options.symbol,
      slug: options.symbol.toUpperCase(),
    }, options)
  }

}
