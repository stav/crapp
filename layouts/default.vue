<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="navDrawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon
              v-if="item.icon"
              v-text="item.icon"
            />
            <v-img
              v-if="item.image"
              :src="item.image"
              class="image-icon-layout"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app :clipped-left="clipped">
      <v-app-bar-nav-icon
        @click.stop="navDrawer = !navDrawer"
        title="Toggle navigation drawer"
      />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        title="Toggle navigation size"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
        title="Toggle navigation clipping"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="absolute = !absolute"
        title="Toggle footer absolute"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      navDrawer: {{ navDrawer }}
      <v-spacer />
      flyoutDrawer: {{ flyoutDrawer }}
      <v-spacer />
      flyoutCoinDrawer: {{ flyoutCoinDrawer }}
      <v-spacer />
      flyoutRepoDrawer: {{ flyoutRepoDrawer }}
      <v-spacer />
      <v-btn icon @click.stop="flyDrawerOut">
        <v-icon>mdi-bitcoin</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <coin-flyout v-show="flyoutCoinDrawer" />
    <repo-flyout v-show="flyoutRepoDrawer" />

    <c-footer :absolute="absolute" />
  </v-app>
</template>

<script>
import coinbaseImageIcon from '@/assets/lh3.googleusercontent.com/rq5wUrwR5zZKqRQol3IfwOENAKDH51RHrqLS2Mq8ttsN7Nt8DSaib6M7Ng0ZiwtOsoM=w27.png'
import binanceImageIcon from '@/assets/logos-download.com/Binance_logo_coin.png'
import flyoutCoin from '@/components/FlyoutCoin.vue'
import flyoutRepo from '@/components/FlyoutRepo.vue'
import cFooter from '@/components/Footer.vue'

export default {

  components: {
    'coin-flyout': flyoutCoin,
    'repo-flyout': flyoutRepo,
    'c-footer': cFooter,
  },

  data () {
    return {
      clipped: true,
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
      miniVariant: false,
      title: 'CrApp'
    }
  },

  computed: {
    flyoutDrawer () {
      return this.$store.state.flyoutDrawer
    },
    flyoutCoinDrawer () {
      return this.$store.state.flyoutCoinDrawer
    },
    flyoutRepoDrawer () {
      return this.$store.state.flyoutRepoDrawer
    },
  },

  methods: {
    flyDrawerOut () {
      if (this.flyoutDrawer) {
        this.$store.commit(this.flyoutDrawer, {fly: true})
      }
    }
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
