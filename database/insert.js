import { v4 as uuidv4 } from 'uuid'
import repositorys from '~/data/repositorys'

let CTX = null

/*
** exportCoinSymbols
**
** Return a list of coin symbols
*/
function exportCoinSymbols (repo) {
  return repo.coins?.map(coin => coin.symbol)
}

/*
** insertCoins
**
** Insert all given coins if doesn't exist, otherwise if it does then ignore
*/
function insertCoins (symbols) {
  for (const symbol of symbols || []) {
    let coin = CTX.state.Coin.find(coin => coin.symbol === symbol)
    if (!coin) {
      coin = {
        id: uuidv4(),
        name: symbol,
        slug: symbol.toUpperCase(),
        price: null,
        symbol,
      }
      // console.log('insertCoins', symbol, coin)
      CTX.commit('addCoin', coin)
    }
  }
}

/*
** insertRepository
**
** Insert the given repository into the db
*/
function insertRepository (input) {
  insertCoins(exportCoinSymbols(input))
  const coins = input.coins?.map(_ => ({
    id: CTX.state.Coin.find(coin => coin.symbol === _.symbol).id,
    quantity: _.quantity,
    symbol: _.symbol,
  })) || []
  const repo = {
    id: uuidv4(),
    name: input.name,
    slug: input.name.toLowerCase().replace(/\s/g, '-').replace(/[.()]/g, ''),
    pairs: input.pairs,
    active: true,
    coins,
  }
  CTX.commit('addRepository', repo)
  return repo
  // const data = await Repository.insert({ data: repo })
  // return mergeRepository(input, data)
}

/*
** insertRepositorys
**
** Insert all the given repositories into the db
*/
function insertRepositorys (inputs) {
  for (const input of inputs) {
    const repo = insertRepository(input)
    console.log('insertRepositorys', repo)
    // insertTransactions(repo)
    // insertStatements(repo)
  }
}

/*
** loadRepositorys
**
** Read the list of repository data from input file and load up the db
*/
export async function loadRepositorys (ctx) {
  CTX = ctx
  // CTX.state.Coin.length = 0
  CTX.state.Repository.length = 0
  // Coin.deleteAll()
  // RepoCoin.deleteAll()
  // Statement.deleteAll()
  // Transaction.deleteAll()
  // Repository.deleteAll()
  insertRepositorys(await repositorys())
  console.warn('loadRepositorys FINISHED')
}
