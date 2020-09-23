<template>
  <v-navigation-drawer fixed app v-model="flyoutDrawer" :clipped="true" :right="true">
    <v-expansion-panels multiple>
      <flyout-panel-coin />
      <flyout-panel-repo />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import coinbaseImageIcon from '@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'
import flyoutPanelCoin from '@/components/FlyoutPanelCoin.vue'
import flyoutPanelRepo from '@/components/FlyoutPanelRepo.vue'
import cFooter from '@/components/Footer.vue'

export default {

  components: {
    'flyout-panel-coin': flyoutPanelCoin,
    'flyout-panel-repo': flyoutPanelRepo,
    'c-footer': cFooter,
  },

  data () {
    return {
      navDrawer: false,
      absolute: false,
      items: [
        {
          title: 'Welcome',
          icon: 'mdi-apps',
          to: '/'
        },
        {
          title: 'Coinbase',
          image: coinbaseImageIcon,
          to: '/coinbase'
        },
        {
          title: 'Binance',
          image: binanceImageIcon,
          to: '/binance'
        },
        {
          title: 'Repos',
          icon: 'mdi-bitcoin',
          to: '/repos'
        },
      ],
      miniVariant: true,
      title: 'CrApp'
    }
  },

  computed: {
    flyoutDrawer: {
      get () {
        return this.$store.state.flyoutDrawer
      },
      set (value) {
        this.$store.commit('setFlyoutDrawer', value)
      }
    },
  },

}
</script>

<style lang="scss">
.image-icon-layout {
  filter: grayscale(100%);
  max-width: 27px;
  max-height: 27px;
}
</style>
