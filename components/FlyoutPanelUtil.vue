<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6" color="accent" />
    <v-expansion-panel-content color="accent">
      <v-card class="mx-auto">
        <v-card-text class="accent"> navDrawer:          {{ navDrawer }}          </v-card-text>
        <v-card-text class="accent"> footerAbsolute:     {{ footerAbsolute }}     </v-card-text>
        <v-card-text class="accent"> switchAmountValue:  {{ switchAmountValue }}  </v-card-text>
        <v-card-text class="accent"> flyoutPanels:       {{ flyoutPanels }}       </v-card-text>
        <v-card-text class="accent"> coinPockets:        {{ coinPockets }}        </v-card-text>
        <v-card-text class="accent"> repoPockets:        {{ repoPockets }}        </v-card-text>
        <v-card-text class="accent"> flyoutDrawer:       {{ flyoutDrawer }}       </v-card-text>
        <v-card-text class="accent"> flyoutCoin:         {{ flyoutCoin }}         </v-card-text>
        <v-card-text class="accent"> flyoutRepoId:       {{ flyoutRepoId }}       </v-card-text>
        <v-card-text class="accent"> statementBalances:  {{ statementBalances }}  </v-card-text>
        <v-card-text class="accent"> statement:          {{ statement }}          </v-card-text>
        <v-card-text class="accent"> repoCoinValueRange: {{ repoCoinValueRange }} </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  computed: {
    navDrawer () {
      return this.$store.state.navDrawer
    },
    footerAbsolute () {
      return this.$store.state.footerAbsolute
    },
    switchAmountValue () {
      return this.$store.state.switchAmountValue
    },
    repoCoinValueRange () {
      return this.$store.state.repoCoinValueRange
    },
    flyoutPanels () {
      return this.$store.state.flyoutPanels
    },
    coinPockets () {
      return this.$store.state.coinPockets
    },
    repoPockets () {
      return this.$store.state.repoPockets
    },
    flyoutDrawer () {
      return this.$store.state.flyoutDrawer
    },
    flyoutCoin () {
      return this.$store.state.flyoutCoin
    },
    flyoutRepoId () {
      return this.$store.state.flyoutRepoId
    },
    statementBalances () {
      return this.$store.state.statementBalances
    },
    statement () {
      return this.$store.state.statement
    },
  }
}
</script>
