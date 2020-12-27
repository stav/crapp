import * as CryptoDotCom from './cdc'
import * as CoinbasePro from './coinbasepro'
import * as BlockFi from './blockfi'
import * as UniSwap from './uniswap'
import * as Kraken from './kraken'
import repositorys from '~/data/repositorys'
import Statement from '~/models/Statement'
import Transaction from '~/models/Transaction'
import Repository from '~/models/Repository'
import RepoCoin from '~/models/RepoCoin'
import Coin from '~/models/Coin'

const translators = {
  kraken: Kraken,
  blockfi: BlockFi,
  uniswap: UniSwap,
  coinbase: CoinbasePro,
  'crypto.com': CryptoDotCom,
}

/*
** exportCoinSymbols
**
** Return a list of coin symbols
*/
function exportCoinSymbols (repo) {
  return repo.coins.map(coin => coin.symbol)
}

/*
** exportTranSymbols
**
** Return a list of transaction symbols
*/
function exportTranSymbols (repo) {
  let symbols
  switch (repo.slug) {
    case 'coinbase':
      symbols = CoinbasePro.mapTransactionSymbols(repo.trans)
      break

    default:
      symbols = repo.trans?.map(tran => tran.symbol) || []
  }
  return symbols
}

/*
** insertCoins
**
** Insert all given coins
*/
function insertCoins (symbols) {
  for (const symbol of symbols || []) {
    const _coin = Coin.query().where('symbol', symbol).first()
    if (!_coin) {
      Coin.insert({ data: { symbol } })
    }
  }
}

/*
** insertTransactions
**
** Insert all of the repo's transactions
*/
function insertTransactions (repo) {
  if (repo.slug in translators) {
    insertCoins(exportTranSymbols(repo))
    translators[repo.slug].insertTransactions(repo.id, repo.trans)
  } else {
    console.debug(`No transactions for repository (${repo.name})`)
  }
}

/*
** insertStatements
**
** Insert all given statements
*/
function insertStatements (repo) {
  switch (repo.slug) {
    case 'coinbase':
      CoinbasePro.insertStatements(repo)
      break

    default:
      console.debug(`No statements for repository (${repo.name})`)
  }
}

/*
** insertRepository
**
** Insert the given repository into the db
*/
function insertRepository (repo) {
  insertCoins(exportCoinSymbols(repo))
  Repository.insert({
    data: {
      coins: repo.coins.map(_ => ({
        coinId: Coin.query().where('symbol', _.symbol).first().id,
        quantity: _.quantity,
      })),
      active: repo.active,
      name: repo.name,
    }
  })
}

/*
** insertRepositorys
**
** Insert all the given repositories into the db
*/
function insertRepositorys (inputs) {
  for (const input of inputs) {
    insertRepository(input)
    const repoId = Repository.query().where('name', input.name).first().id
    insertTransactions({
      id: repoId,
      name: input.name,
      slug: input.slug,
      trans: input.transactions,
    })
    insertStatements({
      id: repoId,
      name: input.name,
      slug: input.slug,
      stmts: input.statements,
    })
  }
}

/*
** loadRepositorys
**
** Read the list of repository data from input file and load up the db
*/
export async function loadRepositorys () {
  Coin.deleteAll()
  RepoCoin.deleteAll()
  Statement.deleteAll()
  Transaction.deleteAll()
  Repository.deleteAll()
  insertRepositorys(await repositorys())
}
