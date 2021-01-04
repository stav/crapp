<template>
  <div>
    <v-badge
      :color="color"
      overlap offset-x="20"
      :content="free"
    >
      <v-avatar max-width="30" max-height="30">
        <v-img max-width="30" height="30" contain :src="logo" class="invert" />
      </v-avatar>
    </v-badge>
  </div>
</template>

<script>
export default {

  /*
  ** PROPS
  */
  props: {
    symbol: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
    free: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
    color: {
      type: String,
      required: false,
      default() {
        return 'primary'
      },
    },
  },

  /*
  ** COMPUTED
  */
  computed: {
    logo () {
      const symbol = this.symbol || this.$store.state.flyoutCoin?.symbol
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

}
</script>

<style lang="scss" scoped>
// .invert-green {
//   filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%);
// }
.invert {
  filter: invert(100%) saturate(0);
}
</style>
