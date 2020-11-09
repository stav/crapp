<template>
  <v-app dark>
    <v-navigation-drawer
      fixed app
      v-model="navDrawer"
      :mini-variant="true"
      :expand-on-hover="true"
      :clipped="true"
    >
      <v-list>
        <v-list-item exact router :to="item.to" v-for="(item, i) in items" :key="i">
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

    <flyout-drawer />

    <main-bar />

    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <c-footer />
  </v-app>
</template>

<script>
import coinbaseImageIcon from '@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'
import flyoutDrawer from '@/components/FlyoutDrawer.vue'
import mainBar from '@/components/MainBar.vue'
import cFooter from '@/components/Footer.vue'

export default {

  components: {
    'flyout-drawer': flyoutDrawer,
    'c-footer': cFooter,
    'main-bar': mainBar,
  },

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
