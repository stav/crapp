/*
** UniSwap data assist
**
** Data files:
**
**   repositories.json:
**     {...
**       { "name": "UniSwap (MetaMask)",
**         "coins": [ { "symbol":"ETH", "quantity":1 } ],
**         "xfile": "metamask.etherscan.json" },... }
**
**   metamask.etherscan.json: // Export/convert from etherscan.io
**     [
**       { "Txhash": "0xa3a15d077e38749abe200ccf8e7cf",
**         "UnixTimestamp": "1598472352",
**         "DateTime": "2020-08-26 20:05:52",
**         "Value_IN(ETH)": "0.1", // Do not duplicate in local activity
**         "Value_OUT(ETH)": "0",  // Do not duplicate in local activity
**         "CurrentValue @ $1230.02/Eth": "123.00",
**         "TxnFee(ETH)": "0.001869",
**         "TxnFee(USD)": "2.29890738",
**         "Historical $Price/Eth": "386.02" },... ]
**
**   metamask.local.json:
**     {
**       "0xe9f9277781b96a84babf7b5b58e7a3c6db": { // Transaction Hash
**         "note": "Airdrop 400 UNI From Uniswap",
**         "activity": { "UNI": 400 }
**       },
**       "0x617d50525b2ef0f712ef3ae19c46f96d9b": {
**       "note": "Swap 1 BTC For 4000 UNI",
**       "activity": { "BTC": -1, "UNI": 4000 }
**       },... }
*/
import EtherscanLocalData from '~/data/metamask.local'
import Transaction from '~/models/Transaction'
import Coin from '~/models/Coin'

/*
** insertTransactions
**
** Insert all given transactions
*/
export function insertTransactions (repoId, trans) {
  // Define the function to do the inserting
  // Notice how all the variables are hoisted
  function insertTransaction () {
    Transaction.insert({
      data: {
        repoId,
        coinId: coin.id,
        quantity,
        timestamp: parseInt(tran.UnixTimestamp) * 1000,
        date: tran.DateTime,
        type: 'UniSwap',
        note: `${localTran?.note || tran.PrivateNote} on ${tran.DateTime}`,
      }
    })
  }

  // Declare the variables to be hoisted into insertTransaction
  let coin, tran, symbol, quantity, localTran

  // Loop over the transactions that don't have any errors
  for (tran of trans.filter(t => !t.ErrCode) || []) {
    // Check if we have local data
    localTran = EtherscanLocalData[tran.Txhash]
    // First we insert the Ethers, if any
    coin = Coin.query().where('symbol', 'ETH').first()
    // Ether in
    const etherIn = parseFloat(tran['Value_IN(ETH)'])
    if (etherIn) {
      quantity = etherIn
      insertTransaction()
    }
    // Ether out
    const etherOut = parseFloat(tran['Value_OUT(ETH)'])
    if (etherOut) {
      quantity = etherOut * -1
      insertTransaction()
    }
    // Lastly we insert any non-ether token data
    for ([symbol, quantity] of Object.entries(localTran?.activity || {})) {
      coin = Coin.query().where('symbol', symbol).first()
      insertTransaction()
    }
  }
}

/*
** mapTransactionSymbols
**
** Map a list of the transactions symbols found in the local data file
** The main Etherscan transaction file will only have the symbol ETH
*/
export function mapTransactionSymbols (_trans) {
  const symbols = ['ETH']
  for (const localTran of Object.values(EtherscanLocalData || {})) {
    for (const symbol in localTran.activity) {
      symbols.push(symbol)
    }
  }
  return symbols
}
