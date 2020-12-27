<template>
  <v-card class="mx-auto">
    <v-app-bar color="blue darken-4">
      <v-icon class="mr-2">mdi-script-text-outline</v-icon> Statements
    </v-app-bar>
    <v-simple-table fixed-header height="80vh">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"> Description </th>
            <th class="text-right" v-for="symbol of symbols" :key="symbol" v-text="symbol" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in matrix" :key="i" :title="JSON.stringify(row.statement)">
            <td>{{ row.desc }}</td>
            <td v-for="symbol of symbols" :key="symbol" v-text="row[symbol]" class="text-right" />
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { formatAmount } from '@/utils'

function keys(stmt) {
  return [].concat(
    Object.keys(stmt.fee),
    Object.keys(stmt.match),
    Object.keys(stmt.deposit),
    Object.keys(stmt.withdrawal),
  )
}

function desc(stmt) {
  const desc = []

  const deposits = Object.entries(stmt.deposit)
  if (deposits.length > 0) {
    for (const [symbol, deposit] of deposits) {
      desc.push(`Deposit ${formatAmount(deposit.amount)} ${symbol}`)
    }
  }
  const matchs = Object.entries(stmt.match)
  if (matchs.length > 0) {
    const tradeFrom = []
    const tradeTo = []
    for (const [symbol, match] of matchs) {
      const trade = `${formatAmount(match.amount)} ${symbol}`
      if (match.amount < 0) {
        tradeFrom.push(trade)
      } else {
        tradeTo.push(trade)
      }
    }
    desc.push(`Trade ${tradeFrom} for ${tradeTo}`)
  }
  const withdrawals = Object.entries(stmt.withdrawal)
  if (withdrawals.length > 0) {
    for (const [symbol, withdrawal] of withdrawals) {
      desc.push(`Withdrawal ${formatAmount(withdrawal.amount)} ${symbol}`)
    }
  }

  return desc.join()
}

export default {

  /*
  ** FETCH
  */
  async fetch () {
    await this.$store.dispatch('loadRepositorys')
    this.load()
  },

  /*
  ** DATA
  */
  data: () => ({
    matrix: [{}],
  }),

  /*
  ** COMPUTED
  */
  computed: {
    statements () {
      const statements = this.$store.$db().model('statements')
      return statements.all()
    },
    symbols () {
      // [["USDC"], ["USD"], ["USD", "USD", "BTC"],…]
      const arrayOfSymbolArrays = this.statements.map(s => [].concat(keys(s)))

      // ["USDC", "USD", "USD", "USD", "BTC",…]
      const arrayOfAllSymbols = arrayOfSymbolArrays.flat()

      // {"USDC", "USD", "BTC", "EOS", "COMP",… }
      const setOfUniqueSymbols = new Set(arrayOfAllSymbols)

      // ["BTC", "CGLD", "COMP", "EOS", "ETH",…]
      const arrayOfUniqueSymbols = Array.from(setOfUniqueSymbols).sort()
      return arrayOfUniqueSymbols
    },
  },

  /*
  ** METHODS
  */
  methods: {

    balance (symbol, statement) {
      const balance = Math.min(
        statement.fee[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.match[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.deposit[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.withdrawal[symbol]?.balance || Number.POSITIVE_INFINITY,
      )
      return balance === Number.POSITIVE_INFINITY ? '' : formatAmount(balance)
    },

    load () {
      const runningBalances = {}
      for (const symbol of this.symbols) {
        runningBalances[symbol] = ''
      }
      const matrix = []
      for (const statement of this.statements) {
        const row = {
          statement,
          desc: desc(statement),
        }
        for (const symbol of this.symbols) {
          row[symbol] = this.balance(symbol, statement) || runningBalances[symbol]
          runningBalances[symbol] = row[symbol]
        }
        matrix.push(row)
      }
      console.log(matrix)
      this.matrix = matrix
    },

  },

}
</script>
