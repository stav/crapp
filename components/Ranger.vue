<template>
  <v-range-slider
    v-model="range"
    hide-details
    :min="min"
    :max="max"
    class="align-center"
  >
    <template v-slot:prepend>
      <v-text-field
        :value="range[0]"
        class="mt-0 pt-0"
        hide-details
        single-line
        type="number"
        style="width: 70px"
        @change="setLowRange"
      />
    </template>
    <template v-slot:append>
      <v-text-field
        :value="range[1]"
        class="mt-0 pt-0"
        hide-details
        single-line
        type="number"
        style="width: 80px"
        @change="setHighRange"
      />
    </template>
  </v-range-slider>
</template>

<script>
let constants
try {
  constants = require('~/data/constants')
} catch (error) {
  constants = {}
}

export default {

  /*
  ** DATA
  */
  data: () => ({
    min: constants.COIN_VALUATION_RANGE_MIN,
    max: constants.COIN_VALUATION_RANGE_MAX || 999999,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    range: {
      get () {
        return this.$store.state.repoCoinValueRange
      },
      set (value) {
        this.$store.commit('setRepoCoinValueRange', value)
      }
    },
  },

  /*
  ** METHODS
  */
  methods: {
    setLowRange (value) {
      this.range = [value, this.range[1]]
    },
    setHighRange (value) {
      this.range = [this.range[0], value]
    },
  },

}
</script>
