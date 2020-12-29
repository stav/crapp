<template>
  <v-card class="mx-auto">
    <v-app-bar color="blue darken-4">
      <v-icon class="mr-2">mdi-script-text-outline</v-icon>
      Statement for Coinbase Pro
      <v-spacer />
      Each row is a separate order
    </v-app-bar>
    <v-simple-table dense fixed-header height="80vh">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"> Date </th>
            <th class="text-left"> Description </th>
            <th class="text-right" v-for="symbol of symbols" :key="symbol" v-text="symbol" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="statement of statements" :key="statement.id" :title="JSON.stringify(statement)">
            <td>{{ statement.timestring }}</td>
            <td>{{ desc(statement) }}</td>
            <td v-for="symbol of symbols" :key="symbol" v-text="balance(symbol, statement)" class="text-right" />
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
      return [
        statement.match[symbol]?.amount,
        statement.deposit[symbol]?.amount,
        statement.withdrawal[symbol]?.amount,
      ]
        .filter(amount => amount)
        .map(amount => formatAmount(amount))
        .join()
    },

    desc(stmt) {
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

  },

}
</script>
