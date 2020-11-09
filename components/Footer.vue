<template>
  <v-footer app :absolute="footerAbsolute">
    <span>&copy; {{ new Date().getFullYear() }}</span>
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
