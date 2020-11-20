<template>
  <div>
    <v-badge
      color="primary"
      overlap offset-x="20"
      :content="quantity"
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
    quantity: {
      type: String,
      required: false,
      default() {
        return 0
      },
    },
  },

  /*
  ** COMPUTED
  */
  computed: {
    logo () {
      const symbol = this.$store.state.flyoutCoin?.symbol
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
