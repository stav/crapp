<template>
  <v-card class="mx-auto">
    <v-app-bar color="blue darken-4">
      <v-icon class="mr-2">mdi-script-text-outline</v-icon>
      Statement for Coinbase Pro
      <v-spacer />
      <v-switch
        v-model="showBalances"
        class="ml-3 mr-2"
        hide-details
        title="Show the coin columns are running balances?"
      />
      <span @click="showBalances=true" class="clickable text--secondary"> Balances </span>
      <v-spacer />
      <span v-show="showBalances" class="mr-1">Coin values are balances (totals) |</span>
      <span>Each row is a separate order</span>
    </v-app-bar>
    <v-simple-table dense fixed-header height="80vh">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left"> Date </th>
            <th class="text-left"> Type </th>
            <th class="text-left"> Order </th>
            <th class="text-right"> Amount </th>
            <th class="text-right"> Coin </th>
            <th class="text-right"> Price </th>
            <th class="text-right" v-for="symbol of symbols" :key="symbol" v-text="symbol" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="statement of statements" :key="statement.id"
            @click="() => load(statement)"
          >
            <td>{{ date(statement) }}</td>
            <td>{{ type(statement) }}</td>
            <td>{{ desc(statement) }}</td>
            <td class="text-right">{{ size(statement) }}</td>
            <td class="text-right">{{ coin(statement) }}</td>
            <td class="text-right">{{ cost(statement) }}</td>
            <td v-for="symbol of symbols" :key="symbol" v-text="value(symbol, statement)" class="text-right" />
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
  ** COMPUTED
  */
  computed: {
    statements () {
      return this.$store.getters.statements
    },
    symbols () {
      // [["USDC"], ["USD"], ["USD", "USD", "BTC"],…]
      const arrayOfSymbolArrays = this.statements.map(s => [].concat(keys(s)))

      // ["USDC", "USD", "USD", "USD", "BTC",…]
      const arrayOfAllSymbols = arrayOfSymbolArrays.flat()

      // {"USDC", "USD", "BTC", "EOS", "COMP",…}
      const setOfUniqueSymbols = new Set(arrayOfAllSymbols)

      // ["BTC", "CGLD", "COMP", "EOS", "ETH",…]
      const arrayOfUniqueSymbols = Array.from(setOfUniqueSymbols).sort()
      return arrayOfUniqueSymbols
    },
    showBalances: {
      get () {
        return this.$store.state.statementBalances
      },
      set (value) {
        this.$store.commit('setStatementBalances', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {

    amounts (symbol, statement) {
      return [
        statement.match[symbol]?.amount,
        statement.deposit[symbol]?.amount,
        statement.withdrawal[symbol]?.amount,
      ].filter(amount => amount)
    },

    amount (symbol, statement) {
      const amounts = this.amounts(symbol, statement)
      if (amounts.length > 1) {
        console.error(`Statement contains more than one amount for ${symbol} ${statement}`)
      }
      return amounts[0] || 0
    },

    balance (symbol, statement) {
      const balance = Math.min(
        statement.fee[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.match[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.deposit[symbol]?.balance || Number.POSITIVE_INFINITY,
        statement.withdrawal[symbol]?.balance || Number.POSITIVE_INFINITY,
      )
      return balance === Number.POSITIVE_INFINITY ? '' : balance
    },

    value (symbol, statement) {
      const value = this.showBalances
        ? this.balance(symbol, statement)
        : this.amount(symbol, statement)
      return value ? formatAmount(value) : ''
    },

    type (stmt) {
      return [
        Object.entries(stmt.match).length ? 'Trade' : null,
        Object.entries(stmt.deposit).length ? 'Deposit' : null,
        Object.entries(stmt.withdrawal).length ? 'Withdrawal' : null,
      ].filter(_ => _).join()
    },

    size (stmt) {
      const desc = this.desc(stmt).split(' ')
      return desc[desc.length - 2]
    },

    coin (stmt) {
      const desc = this.desc(stmt).split(' ')
      return desc[desc.length - 1]
    },

    cost (stmt) {
      const regex = /(?<frAmt>[-\d,.]+)\s+(?<frSym>\w+)\s+for\s+(?<toAmt>[-\d,.]+)\s+(?<toSym>\w+)/
      if (this.type(stmt) === 'Trade') {
        const desc = this.desc(stmt)
        const groups = regex.exec(desc).groups
        const frAmt = parseFloat(groups.frAmt.replace(',', ''))
        const toAmt = parseFloat(groups.toAmt.replace(',', ''))
        const price = formatAmount(Math.abs(frAmt / toAmt))
        if (groups.frSym === 'USD') {
          return `$${price} / ${groups.toSym}`
        }
        return `${price} ${groups.frSym} / ${groups.toSym}`
      }
    },

    date (stmt) {
      function pad(value) {
        return value.toString().padStart(2, '0')
      }
      const date = new Date(stmt.timestamp)
      return `${date.getFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
    },

    desc (stmt) {
      const desc = []

      const deposits = Object.entries(stmt.deposit)
      if (deposits.length > 0) {
        for (const [symbol, deposit] of deposits) {
          desc.push(`${formatAmount(deposit.amount)} ${symbol}`)
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
        desc.push(`${tradeFrom} for ${tradeTo}`)
      }
      const withdrawals = Object.entries(stmt.withdrawal)
      if (withdrawals.length > 0) {
        for (const [symbol, withdrawal] of withdrawals) {
          desc.push(`${formatAmount(withdrawal.amount)} ${symbol}`)
        }
      }
      return desc.join()
    },

    load (stmt) {
      this.$store.commit('setStatement', stmt)
    },

  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
