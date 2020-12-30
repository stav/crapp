<template>
  <v-snackbar
    top right app
    v-model="snackbarModel"
    timeout="3000"
    color="light-blue darken-4"
  >
    <div class="clickable" @click="() => log()">
      {{ snackbarText }}
    </div>
  </v-snackbar>
</template>

<script>
export default {

  /*
  ** COMPUTED
  */
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
  },

  /*
  ** METHODS
  */
  methods: {
    log () {
      console.info(this.snackbarText)
      this.snackbarModel = false
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
