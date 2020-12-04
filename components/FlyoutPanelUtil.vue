<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6" color="accent" />
    <v-expansion-panel-content color="blue-grey darken-2">
      <v-card class="mx-auto">
        <v-card-text class="accent"> navDrawer:      {{ navDrawer }}      </v-card-text>
        <v-card-text class="accent"> footerAbsolute: {{ footerAbsolute }} </v-card-text>
        <v-card-text class="accent"> repoCoinValue:  {{ repoCoinValue }}  </v-card-text>
        <v-card-text class="accent"> repoZeroCoins:  {{ repoZeroCoins }}  </v-card-text>
        <v-card-text class="accent"> flyoutPanels:   {{ flyoutPanels }}   </v-card-text>
        <v-card-text class="accent"> coinPockets:    {{ coinPockets }}    </v-card-text>
        <v-card-text class="accent"> flyoutDrawer:   {{ flyoutDrawer }}   </v-card-text>
        <v-card-text class="accent"> flyoutCoin:     {{ flyoutCoin }}     </v-card-text>
        <v-card-text class="accent"> flyoutRepoId:   {{ flyoutRepoId }}   </v-card-text>
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
    repoCoinValue () {
      return this.$store.state.repoCoinValue
    },
    repoZeroCoins () {
      return this.$store.state.repoZeroCoins
    },
    flyoutPanels () {
      return this.$store.state.flyoutPanels
    },
    coinPockets () {
      return this.$store.state.coinPockets
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
  }
}
</script>
