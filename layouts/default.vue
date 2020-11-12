<template>
  <v-app dark>
    <nav-drawer />
    <flyout-drawer />
    <main-bar />
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <c-footer />
    <notifications />
  </v-app>
</template>

<script>
import notifications from '@/components/Notifications.vue'
import flyoutDrawer from '@/components/FlyoutDrawer.vue'
import navDrawer from '@/components/NavDrawer.vue'
import mainBar from '@/components/MainBar.vue'
import cFooter from '@/components/Footer.vue'

export default {
  components: {
    'flyout-drawer': flyoutDrawer,
    'nav-drawer': navDrawer,
    'c-footer': cFooter,
    'main-bar': mainBar,
    notifications,
  }
}
</script>
