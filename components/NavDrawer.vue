<template>
  <v-navigation-drawer
    fixed app
    v-model="navDrawer"
    :mini-variant="navVariant"
    :clipped="true"
  >
    <v-list>
      <v-list-item
        exact nuxt router :to="item.to"
        v-for="(item, i) in items" :key="i"
        :title="item.title"
        :disabled="item.disabled"
      >
        <v-list-item-action>
          <v-icon v-if="item.icon" v-text="item.icon" />
          <v-img :src="item.image" v-if="item.image" class="image-icon-layout" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import coinbaseImageIcon from '@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'

export default {

  data () {
    return {
      items: [
        {
          title: 'Welcome',
          icon: 'mdi-apps',
          to: '/'
        },
        {
          title: 'Coinbase',
          image: coinbaseImageIcon,
          disabled: !this.$config.canUseCoinbaseApi,
          to: '/coinbase'
        },
        {
          title: 'Binance',
          image: binanceImageIcon,
          disabled: !this.$config.canUseBinanceApi,
          to: '/binance'
        },
        {
          title: 'Repos',
          icon: 'mdi-bitcoin',
          to: '/repos'
        },
        {
          title: 'Pie',
          icon: 'mdi-chart-pie',
          to: '/pie'
        },
        {
          title: 'History',
          icon: 'mdi-chart-areaspline',
          to: '/history'
        },
        {
          title: 'Chart',
          icon: 'mdi-chart-areaspline',
          to: '/chart'
        },
        {
          title: 'Sparks',
          icon: 'mdi-chart-line-variant',
          to: '/sparks'
        },
        {
          title: 'Minis',
          icon: 'mdi-chart-line-variant',
          to: '/minis'
        },
        {
          title: 'Statements',
          icon: 'mdi-script-text-outline',
          to: '/statements'
        },
        {
          title: 'Transactions',
          icon: 'mdi-script-text-outline',
          to: '/transactions'
        },
        {
          title: 'Client',
          icon: 'mdi-fruit-citrus',
          to: '/client'
        },
        {
          title: 'TradingView',
          icon: 'mdi-fruit-cherries',
          to: '/tradingview'
        },
      ],
    }
  },

  computed: {
    navDrawer: {
      get () {
        return this.$store.state.navDrawer
      },
      set (value) {
        this.$store.commit('setNavDrawer', value)
      }
    },
    navVariant () {
      return this.$store.state.navVariant
    },
  },

  mounted() {
    setTimeout(() => { this.navDrawer = false }, 1000)
  },

}
</script>

<style lang="scss" scoped>
.image-icon-layout {
  filter: grayscale(100%);
  max-width: 27px;
  max-height: 27px;
}
</style>
