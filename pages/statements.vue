<template>
  <v-card class="mx-auto">
    <v-app-bar color="blue darken-4">
      <v-icon class="mr-2">mdi-script-text-outline</v-icon> Statements
    </v-app-bar>
    <v-simple-table fixed-header height="80vh">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"> Deposit </th>
            <th class="text-left"> Match </th>
            <th class="text-left"> Withdrawal </th>
            <th class="text-left"> Fee </th>
            <th class="text-right" v-for="symbol of symbols" :key="symbol" v-text="symbol" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in matrix" :key="i">
            <td>{{ row.deposit }}</td>
            <td>{{ row.match }}</td>
            <td>{{ row.withdrawal }}</td>
            <td>{{ row.fee }}</td>
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
      // const matrix = []
      // const runningBalances = Array(this.symbols.length).fill(0)
      const runningBalances = {}
      for (const symbol of this.symbols) {
        runningBalances[symbol] = ''
      }
      for (const statement of this.statements) {
        const row = {
          fee: statement.fee,
          match: statement.match,
          deposit: statement.deposit,
          withdrawal: statement.withdrawal,
        }
        for (const symbol of this.symbols) {
          row[symbol] = this.balance(symbol, statement) || runningBalances[symbol]
          runningBalances[symbol] = row[symbol]
        }
        this.matrix.push(row)
      }
      console.log(this.matrix)
      // this.matrix = matrix
    },

  },

}
</script>
