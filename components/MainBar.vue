<template>
  <v-app-bar fixed app :clipped-left="true" :clipped-right="true">
    <v-app-bar-nav-icon title="Toggle navigation drawer" @click.stop="navDrawer=!navDrawer" />

    <v-btn icon @click.stop="toggleFooterAbsolute" title="Toggle footer absolute">
      <v-icon>mdi-minus</v-icon>
    </v-btn>

    <v-toolbar-title> CrApp </v-toolbar-title>

    <v-spacer />

    <v-btn icon @click.stop="toggleFlyout" title="Toggle coin/repo flyout">
      <v-icon>mdi-bitcoin</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {

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

  methods: {
    toggleFooterAbsolute () {
      this.$store.commit('toggleFooterAbsolute')
    },
    toggleFlyout () {
      this.$store.commit('toggleFlyout')
    },
  },

}
</script>
