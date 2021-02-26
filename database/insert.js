import * as CoinbasePro from './coinbase.ts'
import repositorys from '~/data/repositorys'
import { Repository } from '~/models'

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
    if (!CTX.state.Coin.find(coin => coin.symbol === symbol)) {
      CTX.commit('addCoin', { symbol })
    }
  }
}

/*
** insertStatements
**
** Insert all given statements
*/
function insertStatements (repo) {
  switch (repo.slug) {
    case 'coinbase-pro':
      CoinbasePro.insertStatements(CTX, repo)
      break

    default:
      // console.debug(`No statements for repository (${repo.name})`)
  }
}

/*
** insertRepository
**
** Insert the given repository into the db
*/
function insertRepository (input) {
  Object.freeze(input.statements)
  insertCoins(exportCoinSymbols(input))
  const coins = input.coins?.map(_ => ({
    quantity: _.quantity,
    symbol: _.symbol,
  }))
  const repo = new Repository({
    name: input.name,
    pairs: input.pairs,
    coins,
    statements: input.statements,
  })
  CTX.commit('addRepository', repo)
  return repo
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
    insertStatements(repo)
  }
}

/*
** loadRepositorys
**
** Read the list of repository data from input file and load up the db
*/
export async function loadRepositorys (ctx) {
  CTX = ctx
  CTX.state.Statement.length = 0
  // Transaction.deleteAll()
  CTX.state.Repository.length = 0
  insertRepositorys(await repositorys())
}
