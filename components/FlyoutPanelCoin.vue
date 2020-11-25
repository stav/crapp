<template>
  <v-expansion-panel>
    <!-- HEADER -->
    <v-expansion-panel-header color="blue-grey darken-2">
      {{ symbol }}
      <coin-logo :quantity="coinSumFormat" />
    </v-expansion-panel-header>

    <v-expansion-panel-content color="blue-grey darken-2">
      <!-- NAME -->
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="10"><h3 v-text="name" /></v-col>
          <v-col cols="2">
            <v-btn icon exact nuxt router to="/charts" title="Show chart page for this coin">
              <v-icon> mdi-chart-areaspline </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

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
            class="mr-2"
          >
            <v-list-item-icon>
              <coin-logo :quantity="coinSumForRepoFormat(repo)" />
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
import coinLogo from '@/components/CoinLogo.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'coin-logo': coinLogo,
  },

  /*
  ** DATA
  */
  data () {
    return {
      loading: false,
      convert: null,
      rules: {
        numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
      },
    }
  },

  /*
  ** COMPUTED
  */
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
    /*
    ** repos
    **
    ** Returns an Array of repositories that cointain at least one flyout coin.
    ** Furthermore, each repo.coins contains only flyout coins.
    */
    repos () {
      const model = this.$store.$db().model('repositorys')
      const query = model.query().with('coins', (query) => {
        query.where('coinId', this.coin?.id)
      })
      return query
        .has('coins') // this doesnt really work so we'll need to .filter
        .get() // Renders JavaScript Array
        .filter(repo => repo.coins.length) // why doesnt .has do this?
        .sort((a, b) => this.coinSumForRepo(b) - this.coinSumForRepo(a))
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
  },

  /*
  ** METHODS
  */
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
    coinSumForRepo (repo) {
      return repo.coins?.reduce((total, coin) => total + coin.quantity, 0)
    },
    coinSumForRepoFormat (repo) {
      return formatAmount(this.coinSumForRepo(repo))
    },
  },

}
</script>
