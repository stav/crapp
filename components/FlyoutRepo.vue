<template>
  <v-navigation-drawer
    v-model="flyoutRepoDrawer"
    fixed temporary
    :right="right"
  >
    <v-list>
      <v-list-item @click.native="right = !right">
        <v-list-item-action>
          <v-icon light>
            mdi-repeat
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>Switch drawer (click me)</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-container fluid class="pa-0">
          <v-expansion-panels multiple>
            <flyout-panel-main :coins="coins" :name="repository.name" />
            <flyout-panel-store :coins="coins" :name="repository.name" />
          </v-expansion-panels>
        </v-container>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import flyoutPanelMain from './FlyoutPanelMain.vue'
import flyoutPanelStore from './FlyoutPanelStore.vue'

export default {

  components: {
    'flyout-panel-main': flyoutPanelMain,
    'flyout-panel-store': flyoutPanelStore,
  },

  data: () => ({
    right: true,
  }),

  computed: {
    flyoutRepoDrawer: {
      get () {
        return this.$store.state.flyoutRepoDrawer
      },
      set (value) {
        this.$store.commit('setFlyoutRepoDrawer', { fly: value })
      }
    },
    repository () {
      return this.$store.state.flyoutRepo || {}
    },
    coins () {
      return this.$store.state.flyoutRepo?.coins || []
    },
  },

  methods: {
    formatAmount (value) {
      return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
  },

}
</script>
