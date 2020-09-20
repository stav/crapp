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
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header v-text="repository.name" class="text-h6" />
              <v-expansion-panel-content>
                <v-list>
                  <v-list-item v-for="coin of coins" :key="coin.id" class="accent">
                    <v-list-item-content>
                      <v-list-item-subtitle v-text="coin.name" class="text--disabled" />
                      <v-list-item-title v-text="coin.symbol" class="text-h4" />
                      <v-list-item-title v-text="coin.quantity" :title="`${repository.name} has ${coin.quantity} ${coin.symbol}`" class="text--secondary text-h5" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {

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
