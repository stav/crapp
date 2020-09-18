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
        {{ coin }}
        {{ price }}
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
  },
}
</script>
