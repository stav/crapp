<template>
  <v-navigation-drawer fixed app v-model="flyoutDrawer" :clipped="true" :right="true">
    <v-expansion-panels multiple hover v-model="flyoutPanels">
      <flyout-panel-coin />
      <flyout-panel-repo />
      <flyout-panel-util />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script lang="ts">
import flyoutPanelCoin from '@/components/FlyoutPanelCoin.vue'
import flyoutPanelRepo from '@/components/FlyoutPanelRepo.vue'
import flyoutPanelUtil from '@/components/FlyoutPanelUtil.vue'

export default {

  components: {
    'flyout-panel-coin': flyoutPanelCoin,
    'flyout-panel-repo': flyoutPanelRepo,
    'flyout-panel-util': flyoutPanelUtil,
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
    flyoutPanels: {
      get () {
        return this.$store.state.flyoutPanels
      },
      set (value) {
        this.$store.commit('setFlyoutPanels', value)
      }
    },
  },

}
</script>
