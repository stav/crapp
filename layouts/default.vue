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

    <v-app-bar fixed app :clipped-left="true" :clipped-right="true">
      <v-app-bar-nav-icon title="Toggle navigation drawer" @click.stop="navDrawer=!navDrawer" />

      <v-btn icon title="Toggle footer absolute" @click.stop="absolute = !absolute">
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title" />

      <v-spacer /> navDrawer: {{ navDrawer }}
      <v-spacer /> flyoutDrawer: {{ flyoutDrawer }}
      <v-spacer /> flyoutCoin: {{ flyoutCoin }}
      <v-spacer /> flyoutRepoId: {{ flyoutRepoId }}
      <v-spacer />

      <v-btn icon @click.stop="flyDrawerOut" title="Toggle coin/repo flyout">
        <v-icon>mdi-bitcoin</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <c-footer :absolute="absolute" />
  </v-app>
</template>

<script>
import coinbaseImageIcon from '@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'
import flyoutDrawerX from '@/components/FlyoutDrawer.vue'
import cFooter from '@/components/Footer.vue'

export default {

  components: {
    'flyout-drawer': flyoutDrawerX,
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
        {
          title: 'Charts',
          icon: 'mdi-chart-bubble',
          to: '/charts'
        },
      ],
      miniVariant: true,
      title: 'CrApp'
    }
  },

  computed: {
    flyoutDrawer () {
      return this.$store.state.flyoutDrawer
    },
    flyoutCoin () {
      return this.$store.state.flyoutCoin
    },
    flyoutRepoId () {
      return this.$store.state.flyoutRepoId
    },
  },

  methods: {
    flyDrawerOut () {
      this.$store.commit('toggleFlyout')
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
