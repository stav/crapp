<template>
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
</template>

<script lang="ts">
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

<style lang="scss" scoped>
.image-icon-layout {
  filter: grayscale(100%);
  max-width: 27px;
  max-height: 27px;
}
</style>
