<template>
  <v-card :loading="loading" class="accent mt-4 mx-auto">
    <div class="text-caption ml-2 pt-2" v-show="pair">{{ pair }}</div>
    <v-sparkline
      :value="sparks"
      color="white"
      line-width="2"
      padding="16"
    />
    <v-card-actions>
      <v-btn
        small fab class="accent"
        :disabled="!symbol || !pair"
        @click="clearHistory"
      >
        <v-icon> mdi-close </v-icon>
      </v-btn>
      <v-btn @click="getKrakenData" :disabled="!symbol" class="accent"> History </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {

  /*
  ** PROPS
  */
  props: {
    symbol: {
      type: String,
      required: true,
      default() {
        return ''
      },
    },
  },

  /*
  ** DATA
  */
  data () {
    return {
      loading: false,
    }
  },

  /*
  ** COMPUTED
  */
  computed: {
    sparks () {
      return this.$store.getters.sparkLines()
    },
    pair () {
      return this.$store.getters.sparkPair
    },
  },

  /*
  ** METHODS
  */
  methods: {
    getKrakenData () {
      this.loading = true
      this.$store.dispatch('loadKrakenFly', () => { this.loading = false })
    },
    clearHistory () {
      this.loading = false
      this.$store.commit('setSparks', { data: [] })
      this.$store.commit('setSparkPair', { pair: '' })
    },
  },

}
</script>
