<template>
  <v-expansion-panels multiple accordion hover v-model="coinPockets">
    <v-expansion-panel v-for="pocket in pockets" :key="pocket.name">
      <v-expansion-panel-header :color="pocket.color">
        <template v-slot:default="{ open }">
          {{ pocket.name }}
          <v-fade-transition>
            <span v-if="!open">
              <v-chip
                v-if="['Coins', 'Price', 'Value'].includes(pocket.name)"
                x-small pill class="ml-2 px-2"
                :color="pocket.color + ' darken-1'"
              >
                {{ pocket.front }}
              </v-chip>
            </span>
          </v-fade-transition>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content :color="pocket.color">
        <!-- COINS & VALUE -->
        <div v-if="pocket.name === 'Coins' || pocket.name === 'Value'">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- PRICE -->
        <div v-if="pocket.name === 'Price'">
          <div class="text-h5 font-weight-heavy white--text" v-text="pocket.front" />
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- P & L -->
        <div v-if="pocket.name === 'P & L'">
          <v-btn @click="loadPrices">Prices</v-btn>
          <div class="text-h5 font-weight-heavy white--text mt-2" v-text="pocket.front" />
          <v-list dense two-line class="pa-0">
            <v-subheader class="px-0">{{ buys.length }} buys</v-subheader>
            <v-list-item v-for="buy in buys" :key="buy.id" class="px-0" :title="buy.date">
              <v-list-item-content class="pa-0">
                <v-list-item-title v-text="formatCurrency(buy.quantity * (coin.price - buy.price))" />
                <v-list-item-subtitle>
                  {{ formatAmount(buy.quantity) }} @ {{ formatAmount(buy.price) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="sub-title font-weight-light" v-text="pocket.back" />
        </div>

        <!-- HISTORY -->
        <pocket-history v-if="pocket.name === 'History'" :symbol="symbol" />

        <!-- CONVERT -->
        <pocket-convert v-if="pocket.name.startsWith('Convert')" :symbol="symbol" />

        <!-- REPOS -->
        <pocket-repos v-if="pocket.name === 'Repositories'" :coin="coin" :symbol="symbol" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'
import PocketConvert from './PocketConvert.vue'
import PocketHistory from './PocketHistory.vue'
import PocketRepos from './PocketRepos.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'pocket-convert': PocketConvert,
    'pocket-history': PocketHistory,
    'pocket-repos': PocketRepos,
  },

  /*
  ** COMPUTED
  */
  computed: {
    coinPockets: {
      get () {
        return this.$store.state.coinPockets
      },
      set (value) {
        this.$store.commit('setCoinPockets', value)
      }
    },
    pockets () {
      return [
        { name: 'Coins', color: 'primary', front: this.coinSumFormat, back: this.coinSumAmount },
        { name: 'Price', color: 'accent', front: this.coinPriceCurrency, back: this.coinPriceAmount },
        { name: 'Value', color: 'secondary', front: this.coinValueCurrency, back: this.coinValueAmount },
        { name: 'P & L', color: 'green darken-4', front: this.profit, back: null },
        { name: 'History', color: 'accent', front: null, back: null },
        { name: `Convert ${this.symbol}`, color: 'brown darken-4', front: null, back: null },
        { name: 'Repositories', color: 'black', front: null, back: null },
      ]
    },
    coin () {
      return this.$store.state.flyoutCoin
    },
    symbol () {
      return this.coin?.symbol
    },
    coinSumAmount () {
      return this.$store.getters.coinSum(this.symbol)
    },
    coinSumFormat () {
      return formatAmount(this.coinSumAmount)
    },
    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.symbol)
    },
    coinPriceCurrency () {
      return formatCurrency(this.coinPriceAmount)
    },
    coinValueAmount () {
      return this.coinSumAmount * this.coinPriceAmount
    },
    coinValueCurrency () {
      return formatCurrency(this.coinValueAmount)
    },
    buys () {
      return this.$store.$db()
        .model('transactions')
        .query()
        .where('symbol', this.symbol)
        .where('type', type => type.toLowerCase() === 'buy' || type.toLowerCase() === 'deposit')
        .get()
        .sort((a, b) => b.timestamp - a.timestamp)
    },
    profit () {
      let profit = 0
      console.log('profit: buys', this.buys)
      for (const buy of this.buys) {
        let value
        if (buy.price) {
          value = buy.quantity * (this.coin.price - buy.price)
          profit += value
        } else {
        }
        console.log(`profit: ${buy.date} (${buy.symbol})`, buy.note, buy.quantity, buy.price, value)
      }
      return formatCurrency(profit)
    },
  },

  /*
  ** METHODS
  */
  methods: {
    async loadPrices () {
      for (const buy of this.buys) {
        try {
          const price = await loadPrice(buy)
          console.log(`loadPrices: ${buy.date} (${buy.symbol})`, buy.id, buy.note, buy.quantity, buy.price, price)
          this.$store.$db().model('transactions').update({
            where: buy.id, data: { price }
          })
        } catch (error) {
          console.warn(error.message)
        }
      }
    },
    formatAmount (value) {
      return formatAmount(value)
    },
    formatCurrency (value) {
      return formatCurrency(value)
    },
  },

}

/*
** loadPrice
**
** result == {
**   "candles": [
**     [
**       1599331980000,  // MTS    int   millisecond time stamp
**       10035.810078,   // OPEN   float First execution during the time frame
**       9957.8,         // CLOSE  float Last execution during the time frame
**       10037.99023273, // HIGH   float Highest execution during the time frame
**       9957.8,         // LOW    float Lowest execution during the timeframe
**       426.24771668    // VOLUME float Quantity of symbol traded within the timeframe
**     ]
**   ]
** }
*/
async function loadPrice (buy) {
  const response = await fetch(`/api/bitfinex/candles?symbol=${buy.symbol}&time=${buy.timestamp}&limit=1`)
  const result = await response.json()

  if (result.error) {
    throw new Error(result.error)
  }
  const { candles } = result
  if (candles.length === 0) {
    throw new Error(`No history pricing for ${buy.symbol}`)
  }
  return candles[0][2]
}

</script>
