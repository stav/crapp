<template>
  <v-snackbar
    top right app
    v-model="snackbarModel"
    timeout="3000"
    color="light-blue darken-4"
  >
    <div class="clickable" @click="snackbarModel = false">
      {{ snackbarText }}
    </div>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbarText () {
      return this.$store.state.snackbarText
    },
    snackbarModel: {
      get () {
        return this.$store.state.snackbarModel
      },
      set (value) {
        this.$store.commit('setSnackbarModel', value)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
