<template>
  <div>
    <h2 class="brown--text text--darken"> CrApp, the crypto app.</h2>
    <v-btn exact nuxt router to="/repos" @click.native="getThingsGoing">
      Click me
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    getThingsGoing () {
      this.$store.dispatch('getThingsGoing')
    },
  },
}
</script>
