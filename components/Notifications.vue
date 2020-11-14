<template>
  <v-snackbar
    top right app color="light-green darken-4"
    v-model="snackbarModel"
    timeout="-1"
  >
    <div>
      <v-hover v-slot="{ hover }">
        <v-card
          rounded class="mx-auto"
          :elevation="hover ? 16 : 2"
          :loading="progress<maxProgress"
          title="Press to pin"
          @click="stop"
        >
          <v-card-text>
            <v-icon> mdi-flag </v-icon>
            {{ snackbarText }}
          </v-card-text>
          <template v-slot:progress>
            <v-progress-linear :value="progress" height="1" color="secondary" />
          </template>
        </v-card>
      </v-hover>
    </div>
    <template v-slot:action>
      <v-btn @click="close" title="Close"><v-icon> mdi-close-thick </v-icon></v-btn>
    </template>
    <v-switch v-if="false" class="mt-4 pt-0" color="secondary" v-model="snackbarModel" label="snackbarModel" />
    <v-text-field v-if="false" label="interval" color="secondary" outlined v-model="interval" />
    <v-text-field v-if="false" label="progress" color="secondary" outlined v-model="progress" />
  </v-snackbar>
</template>

<script>
const MAXPROGRESS = 100

export default {

  /*
  ** DATA
  */
  data: () => ({
    interval: 0,
    progress: MAXPROGRESS,
    maxProgress: MAXPROGRESS,
    unsubscribe: null,
  }),

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
  ** WATCH
  */
  watch: {
    progress (val) {
      if (val > 0) { return }
      this.close()
    },
  },

  /*
  ** MOUNTED
  */
  mounted () {
    this.unsubscribe = this.$store.subscribe((mutation, _state) => {
      if (mutation.type === 'snackMessage') {
        if (this.progress < MAXPROGRESS) {
          this.progress = MAXPROGRESS
        } else {
          this.startBuffer()
        }
      }
    })
  },

  /*
  ** BEFORE DESTROY
  */
  beforeDestroy () {
    this.unsubscribe()
    this.stop()
  },

  /*
  ** METHODS
  */
  methods: {
    stop () {
      clearInterval(this.interval)
      this.progress = MAXPROGRESS
    },
    close () {
      this.stop()
      this.snackbarModel = false
    },
    startBuffer () {
      this.progress = MAXPROGRESS

      this.interval = setInterval(() => {
        this.progress -= 1
      }, 100)
    },
  },

}
</script>
