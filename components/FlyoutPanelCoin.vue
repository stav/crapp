<template>
  <v-expansion-panel>
    <!-- HEADER -->
    <v-expansion-panel-header color="blue-grey darken-2">
      <v-img max-width="30" max-height="30" contain :src="logo" class="mr-4" />
      {{ symbol }}
    </v-expansion-panel-header>

    <v-expansion-panel-content color="blue-grey darken-2">
      <!-- NAME -->
      <h3 v-text="name" />

      <!-- TRIBOXS -->
      <v-card class="mt-2 mx-auto">
        <v-card-text class="primary">
          <div class="sub-title font-weight-light"> Coins </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinSumFormat" />
          <div class="sub-title font-weight-light" v-text="coinSumAmount" />
        </v-card-text>
        <v-card-text class="accent">
          <div class="sub-title font-weight-light"> Price </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinPriceCurrency" />
          <div class="sub-title font-weight-light" v-text="coinPriceAmount" />
        </v-card-text>
        <v-card-text class="secondary">
          <div class="sub-title font-weight-light"> Value </div>
          <div class="text-h5 font-weight-heavy white--text" v-text="coinValueCurrency" />
          <div class="sub-title font-weight-light" v-text="coinValueAmount" />
        </v-card-text>
      </v-card>

      <!-- HISTORY SPARK -->
      <v-card :loading="loading" class="accent mt-4 mx-auto">
        <div class="text-caption ml-2 pt-2" v-show="pair">{{ pair }}</div>
        <v-sparkline
          :value="sparks"
          color="white"
          line-width="2"
          padding="16"
        />
        <v-card-actions>
          <v-btn
            small fab class="accent"
            :disabled="!symbol || !pair"
            @click="clearHistory"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <v-btn @click="getKrakenData" :disabled="!symbol" class="accent"> History </v-btn>
        </v-card-actions>
      </v-card>

      <!-- CONVERT -->
      <v-input hide-details class="mt-4">
        <v-text-field
          v-model="convert"
          :label="`Convert ${symbol}`"
          :rules="[rules.numeric]"
          placeholder="1.5"
          hide-details
          clearable
          outlined
          dense
        />
      </v-input>
      <div class="ml-4 mt-2" v-show="convert" v-text="convertedUSD" />

      <!-- REPOS -->
      <v-card class="mt-4 mx-auto">
        <v-list dense>
          <div class="text-subtitle-1 ml-2">Repositories</div>
          <v-list-item
            v-for="repo in repos" :key="repo.id"
            @click="() => flyRepository(repo)"
          >
            <v-list-item-icon>
              <v-icon>mdi-bitcoin</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="repo.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { formatAmount, formatCurrency } from '@/utils'

export default {

  data () {
    return {
      loading: false,
      convert: null,
      rules: {
        numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
      },
    }
  },

  computed: {
    coin () {
      return this.$store.state.flyoutCoin
    },
    name () {
      return this.coin?.name
    },
    symbol () {
      return this.coin?.symbol
    },
    repos () {
      const model = this.$store.$db().model('repositorys')
      const query = model.query().with('coins', (query) => {
        query.where('coinId', this.coin?.id)
      }).has('coins')
      return query.get().filter(repo => repo.coins.length)
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
    convertedUSD () {
      return 'USD ' + formatCurrency(this.convert * this.coinPriceAmount)
    },
    sparks () {
      return this.$store.getters.sparkLines()
    },
    pair () {
      return this.$store.getters.sparkPair
    },
    logo () {
      const symbol = this.$store.state.flyoutCoin?.symbol
      try {
        return require(`@/assets/coins/${symbol}.svg`)
      } catch (e) {
        try {
          return require(`@/assets/coins/${symbol}.png`)
        } catch (e) {
          return require('@/assets/coins/default.svg')
        }
      }
    },
  },

  methods: {
    getKrakenData () {
      this.loading = true
      this.$store.dispatch('loadKrakenFly', () => { this.loading = false })
    },
    clearHistory () {
      this.loading = false
      this.$store.commit('setSparks', { data: [] })
      this.$store.commit('setSparkPair', { pair: '' })
    },
    flyRepository (repo) {
      this.$store.dispatch('flyRepository', repo)
    },
  },

}
</script>
