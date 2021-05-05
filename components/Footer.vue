<template>
  <v-footer app :absolute="footerAbsolute">
    <span>&copy; {{ new Date().getFullYear() }} Steven Almeroth</span>
    <v-spacer />
    v{{ $config.version }}
    <v-img src="/logo-vuejs.png" max-width="20" max-height="20" class="pa-1" title="Powered by Vue.js" />
    <v-img src="/logo-nuxt.png" max-width="20" max-height="20" class="pa-1" title="Powered by Nuxt" />
    <v-img src="/logo-vuetify.png" max-width="20" max-height="20" class="pa-1" title="Powered by Vuetify" />
  </v-footer>
</template>

<script>
export default {
  computed: {
    footerAbsolute () {
      return this.$store.state.footerAbsolute
    },
  }
}
</script>
