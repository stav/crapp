<template>
  <v-navigation-drawer fixed app v-model="flyoutDrawer" :clipped="true" :right="true">
    <v-expansion-panels multiple hover>
      <flyout-panel-coin />
      <flyout-panel-repo />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import flyoutPanelCoin from '@/components/FlyoutPanelCoin.vue'
import flyoutPanelRepo from '@/components/FlyoutPanelRepo.vue'

export default {

  components: {
    'flyout-panel-coin': flyoutPanelCoin,
    'flyout-panel-repo': flyoutPanelRepo,
  },

  computed: {
    flyoutDrawer: {
      get () {
        return this.$store.state.flyoutDrawer
      },
      set (value) {
        this.$store.commit('setFlyoutDrawer', value)
      }
    },
  },

}
</script>
