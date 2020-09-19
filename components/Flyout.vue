<template>
  <v-navigation-drawer
    v-model="flyoutDrawer"
    fixed temporary
    :right="right"
  >
    <v-list>
      <v-list-item @click.native="right = !right">
        <v-list-item-action>
          <v-icon light>
            mdi-repeat
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>Switch drawer (click me)</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-container fluid class="pa-0">
          <v-card>
            <v-toolbar class="text-h6"> {{ coin }} </v-toolbar>
              <v-list>
                <v-list-item class="primary">
                  <v-list-item-content>
                    <v-list-item-subtitle class="text--disabled"> Coins </v-list-item-subtitle>
                    <v-list-item-title v-text="coinSumFormat" class="text-h5" />
                    <v-list-item-subtitle v-text="coinSumAmount" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="accent">
                  <v-list-item-content>
                    <v-list-item-subtitle class="text--disabled"> Price </v-list-item-subtitle>
                    <v-list-item-title v-text="coinPriceCurrency" class="text-h5" />
                    <v-list-item-subtitle v-text="coinPriceAmount" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="secondary">
                  <v-list-item-content>
                    <v-list-item-subtitle class="text--disabled"> Value </v-list-item-subtitle>
                    <v-list-item-title v-text="coinValueCurrency" class="text-h5" />
                    <v-list-item-subtitle v-text="coinValueAmount" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card>
        </v-container>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {

  data: () => ({
    right: true,
  }),

  computed: {
    Coins () {
      return this.$store.$db().model('coins')
    },
    flyoutDrawer: {
      get () {
        return this.$store.state.flyoutDrawer
      },
      set (value) {
        this.$store.commit('setFlyoutDrawer', { fly: value })
      }
    },

    coin () {
      return this.$store.state.flyoutCoin
    },
    price () {
      return this.$store.getters.coinPriceUSD(this.coin)
    },

    coinSumAmount () {
      return this.coinSum(this.coin)
    },
    coinSumFormat () {
      return this.formatAmount(this.coinSumAmount)
    },

    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.coin)
    },
    coinPriceCurrency () {
      return this.formatCurrency(this.coinPriceAmount)
    },

    coinValueAmount () {
      return this.coinSumAmount * this.coinPriceAmount
    },
    coinValueCurrency () {
      return this.formatCurrency(this.coinValueAmount)
    },
  },

  methods: {
    coinSum (symbol) {
      const coins = this.Coins.query().where('symbol',
        value => value === symbol
      ).get()
      return coins.reduce(
        (total, coin) => total + coin.quantity,
        0
      )
    },
    formatAmount (value) {
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
  },

}
</script>
