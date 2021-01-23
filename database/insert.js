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
  return repo.coins?.map(coin => coin.symbol)
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
      symbols = CoinbasePro.mapTransactionSymbols(repo.transactions)
      break

    case 'uniswap':
      symbols = UniSwap.mapTransactionSymbols(repo.transactions)
      break

    default:
      symbols = repo.transactions?.map(tran => tran.symbol) || []
  }
  return symbols
}

/*
** insertCoins
**
** Insert all given coins if doesn't exist, otherwise if it does then ignore
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
    translators[repo.slug].insertTransactions(repo.id, repo.transactions)
  } else {
    // console.debug(`No transactions for repository (${repo.name})`)
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
      // console.debug(`No statements for repository (${repo.name})`)
  }
}

/*
** mergeRepository
**
** Merge all known repository data
**
** data:
**   {"repocoins": [
**      {"id": "$uid867", "coinId": "$uid735", "repoId": "$uid866", "quantity": 2.6888},
**      {"id": "$uid870", "coinId": "$uid734", "repoId": "$uid866", "quantity": 0.03}
**    ],
**    "repositorys": [
**      {"id": "$uid866", "name": "Kraken", "active": true}
**  ] }
*/
function mergeRepository (input, data) {
  if (data.repositorys?.length === 1) {
    const jugg = {
      statements: input.statements,
      transactions: input.transactions,
    }
    return Object.assign(jugg, data.repositorys[0])
  }
  console.error('Should be exactly one repo, found', data)
}

/*
** insertRepository
**
** Insert the given repository into the db
*/
async function insertRepository (input) {
  insertCoins(exportCoinSymbols(input))
  const coins = input.coins?.map(_ => ({
    coinId: Coin.query().where('symbol', _.symbol).first().id,
    quantity: _.quantity,
  })) || []
  const data = await Repository.insert({
    data: {
      coins,
      active: input.active,
      name: input.name,
    }
  })
  return mergeRepository(input, data)
}

/*
** insertRepositorys
**
** Insert all the given repositories into the db
*/
async function insertRepositorys (inputs) {
  for (const input of inputs) {
    const repo = await insertRepository(input)
    insertTransactions(repo)
    insertStatements(repo)
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
  await insertRepositorys(await repositorys())
}
