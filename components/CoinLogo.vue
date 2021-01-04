<template>
  <div>
    <v-badge
      v-if="parseInt(locked)"
      color="black"
      overlap offset-y="20"
      :content="locked"
      bottom
    >
      <coin-logo-free :symbol="symbol" :free="free" :color="color" />
    </v-badge>
    <div v-else>
      <coin-logo-free :symbol="symbol" :free="free" :color="color" />
    </div>
  </div>
</template>

<script>
import coinLogoFree from '~/components/CoinLogoFree.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'coin-logo-free': coinLogoFree,
  },

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
    locked: {
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

}
</script>
