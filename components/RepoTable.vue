<template>
  <v-data-table
    :headers="headers"
    :items="valuedRepositorys"
    item-class="cls"
    v-model="selectedRows"
    show-select
    sort-by="valuation"
    hide-default-footer
    disable-pagination
    dense
    @click:row="flyRepository"
  >
    <template v-slot:body.append v-if="repositorys.length">
      <tr>
        <td v-for="header of fHeaders" :key="header.value" class="text-end">
          <v-sparkline
            v-if="header.coin"
            :value="sparks(header.value)"
            color="white"
            line-width="1"
            width="200"
            height="50"
          />
        </td>
      </tr>
      <tr>
        <td v-for="header of fHeaders" :key="header.value" class="text-end">
          <v-btn
            v-if="header.coin"
            @click="() => flyCoin(header.value)"
            small class="accent px-1"
            v-text="header.value"
            :title="coinPrice(header.value)"
          />
        </td>
      </tr>
      <tr class="primary">
        <td v-for="header of fHeaders" :key="header.value" class="text-end">
          <span v-if="header.value === 'name'"> Total (coins) </span>
          <span
            v-if="header.coin"
            v-text="formatAmount(coinSum(header.value))"
            :title="coinSum(header.value)"
          />
        </td>
      </tr>
      <tr class="accent">
        <td v-for="header of fHeaders" :key="header.value" class="text-end">
          <span v-if="header.value === 'name'"> Price (each) </span>
          <span
            v-if="header.coin"
            v-text="`$${formatAmount(coinPrice(header.value))}`"
            :title="coinPrice(header.value)"
          />
        </td>
      </tr>
      <tr class="secondary">
        <td v-for="header of fHeaders" :key="header.value" class="text-end">
          <div v-if="header.value === 'name'" class="text-h6 text-no-wrap">
            <code> {{ formatCurrency(portfolioTotalUSD()) }} </code>
          </div>
          <span v-if="header.coin" v-text="formatCurrency(coinTotalUSD(header.value))" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'

export default {

  fetchOnServer: true,

  /*
  ** PROPS
  */
  props: {
    symbols: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    repositorys: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  /*
  ** DATA
  */
  data: () => ({
    formatCurrency,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    /*
    ** headers
    **
    ** Data-table options
    **
    ** Return an array of column settings objects
    **
    **   {"text": "", "value": "name"},
    **   {"text": "Valuation", "value": "valuation"},
    **   {"text": "BTC", "value": "BTC", "coin": true },
    **   {"text": "ETH", "value": "ETH", "coin": true },... ]
    */
    headers () {
      /*
      ** Column sorting function
      **
      ** Unfortunately the simple component from Vuetiify doesn't support rendering
      ** so we have to set the "value" pre-rendered and then un-render :) to sort
      */
      function sort (a, b) {
        const _ = _ => (_ || '0').replaceAll(',', '').replaceAll('$', '')
        a = parseFloat(_(a))
        b = parseFloat(_(b))
        if (a < b) { return 1 }
        if (a > b) { return -1 }
        return 0
      }
      /*
      ** Left-most columns (static)
      */
      const headers = [
        { text: '', value: 'name', sortable: true },
        { text: 'Valuation', value: 'valuation', align: 'end', sortable: true, sort },
      ]
      /*
      ** Right-most columns (dynamically created one for each coin)
      */
      for (const symbol of this.symbols) {
        headers.push({
          text: symbol,
          value: symbol,
          align: 'end',
          sortable: true,
          coin: true,
          sort,
        })
      }
      return headers
    },
    fHeaders () {
      return [{}].concat(this.headers) // Add a blank column to beginning of headers
    },
    /*
    ** valuedRepositorys
    **
    ** Data-table data
    **
    ** Return an array of row objects
    **
    ** [{id:'$uid1', name:'Ledger', valuation:'$1,137.36',
    **   BTC:'$1,140',
    **   coins: [
    **     { id: "$uid3",
    **       coinId: "$uid2",
    **       repoId: "$uid1",
    **       quantity: 0.1} ]
    **  },...]
    */
    valuedRepositorys () {
      return this.repositorys.map(this.repoValuation)
    },
    coinValue () {
      return this.$store.state.repoCoinValue
    },
    selectedRows: {
      get () {
        return this.$store.state.selectedRepos
      },
      set (value) {
        this.$store.commit('setSelectedRepos', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {
    /*
    ** repoValuation
    **
    ** Repository valuation
    **
    ** Return the provided repository with the coins property evaluated
    ** with the proper coins from the database as well as a mapping to
    ** create the top-level fields, one for each coin, e.g.:
    **
    **     {BTC:1, ETH:10...}
    */
    repoValuation (repo) {
      const coins = {}
      let valuation = 0
      // First we sum the coins[symbol] values/quantities using only numeric data
      for (const coin of repo.coins) {
        const symbol = coin.coin.symbol
        const value = coin.quantity * this.coinPrice(symbol)
        valuation += value
        symbol in coins || (coins[symbol] = 0) // Init new coin counter to zero
        coins[symbol] += this.coinValue ? value : coin.quantity
      }
      // Then we format these coins[symbol] as formatted text for display
      for (const symbol in coins) {
        const amount = this.formatAmount(coins[symbol])
        coins[symbol] =
          this.coinValue
            ? formatCurrency(amount.replaceAll(',', '')).slice(0, -3)
            : coins[symbol] = amount
      }
      return Object.assign(repo, coins, { valuation: formatCurrency(valuation), cls: 'meat' })
    },
    sparks (symbol) {
      return this.$store.getters.sparkLines(symbol)
    },
    portfolioTotalUSD () {
      return (this.symbols.reduce(
        (total, symbol) => total + (this.coinTotalUSD(symbol) || 0),
        0 // zero starting value
      ))
    },
    flyCoin (symbol) {
      this.$store.dispatch('flyCoin', symbol)
    },
    flyRepository (repo) {
      this.$store.dispatch('flyRepository', repo)
    },
    coinSum (symbol) {
      return this.$store.getters.coinSum(symbol)
    },
    coinPrice (symbol) {
      return this.$store.getters.coinPriceUSD(symbol)
    },
    coinTotalUSD (symbol) {
      const amount = this.coinSum(symbol)
      const price = this.coinPrice(symbol)
      return price ? (amount * price) : ''
    },
    formatAmount (value) {
      return formatAmount(value)
    },
  }

}
</script>

<style lang="scss">
.text-end {
  text-align: right !important;
}
.v-data-table tr.meat:not(.v-data-table__selected) {
  color: #3a3a3a;
}
</style>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
