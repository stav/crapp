<template>
  <v-app-bar color="indigo">
    <v-icon class="mr-2">mdi-bitcoin</v-icon> Repositories <v-spacer />
    {{ coins.length }} coins in {{ repositorys.length }} repos <v-spacer />
    <span @click="coinValue=false" class="clickable text--secondary"> amount </span>
    <v-switch
      v-model="coinValue"
      class="ml-3 mr-2"
      hide-details
      title="Display amount of coins held or the USD valuation"
    />
    <span @click="coinValue=true" class="clickable text--secondary"> value </span>
  </v-app-bar>
</template>

<script>
export default {

  props: {
    coins: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    repositorys: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  computed: {
    coinValue: {
      get () {
        return this.$store.state.repoCoinValue
      },
      set (value) {
        this.$store.commit('setRepoCoinValue', value)
      }
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
