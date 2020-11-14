<template>
  <v-snackbar
    :timeout="-1"
    v-model="snackbarModel"
    top right color="light-green darken-4"
  >
    <div @click="pin">
      <v-progress-linear :value="progress" color="secondary" v-show="progress<100" />
      <v-hover close-delay="100" v-slot="{ hover }">
        <v-list
          dense rounded
          :elevation="hover ? 16 : 2"
          class="clickable mx-auto"
          @click="pin"
        >
          <v-list-item v-for="(text, i) in notifications" :key="i">
            <v-list-item-icon>
              <v-icon> mdi-flag </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="text" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-hover>
    </div>
    <template v-slot:action>
      <v-btn @click="stop" title="Stop">
        <v-icon> mdi-octagon </v-icon>
      </v-btn>
      <v-btn @click="clear" title="Clear">
        <v-icon> mdi-close-circle </v-icon>
      </v-btn>
      <v-btn @click="close" title="Close">
        <v-icon> mdi-close-thick </v-icon>
      </v-btn>
    </template>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="9">
          <v-card class="pa-2" outlined tile> .col-9 </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="pa-2" outlined tile>
            .col-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="pa-2" outlined tile>
            .col-6<br>Subsequent columns continue along the new line.
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-switch class="mt-4 pt-0" color="secondary" v-model="pinned" label="pinned" />
    <v-switch class="mt-0 pt-0" color="secondary" v-model="snackbarModel" label="snackbarModel" />
    <v-switch class="mt-0 pt-0" color="secondary" v-model="snackbarFlag" label="snackbarFlag" />
    <v-switch class="mt-0 pt-0" color="secondary" v-model="idle" label="idle" />
    <v-text-field label="interval" color="secondary" outlined v-model="interval" />
    <v-text-field label="progress" color="secondary" outlined v-model="progress" />
  </v-snackbar>
</template>

<script>
export default {

  /*
  ** DATA
  */
  data: () => ({
    pinned: false,
    interval: 0,
    progress: 100,
    idle: true,
  }),

  /*
  ** COMPUTED
  */
  computed: {
    snackbarText: {
      get () {
        return this.$store.state.snackbarText
      },
      set (value) {
        this.$store.commit('setSnackbarText', value)
      }
    },
    snackbarFlag: {
      get () {
        return this.$store.state.snackbarFlag
      },
      set (value) {
        this.$store.commit('setSnackbarFlag', value)
      }
    },
    snackbarModel: {
      get () {
        return this.$store.state.snackbarModel
      },
      set (value) {
        this.$store.commit('setSnackbarModel', value)
      }
    },
    notifications () {
      console.log('notifications', this.pinned)
      return this.pinned ? this.snackbarText : [this.snackbarText[0]]
    }
  },

  /*
  ** WATCH
  */
  watch: {
    progress (val) {
      if (val > 0) { return }
      this.close()
    },
    snackbarFlag (val) {
      if (val) {
        this.startBuffer()
      }
    },
  },

  /*
  ** MOUNTED
  */
  // mounted () {
  //   this.startBuffer()
  // },

  /*
  ** BEFORE DESTROY
  */
  beforeDestroy () {
    this.stop()
  },

  /*
  ** METHODS
  */
  methods: {
    pin () {
      console.log('pin')
      this.pinned = true
      this.stop()
    },
    stop () {
      console.log('stop')
      clearInterval(this.interval)
      this.progress = 100
      this.idle = true
      this.snackbarFlag = false
    },
    clear () {
      this.snackbarText = []
      this.snackbarFlag = false
    },
    close () {
      this.clear()
      this.pinned = false
      this.snackbarModel = false
    },
    startBuffer () {
      this.idle = false
      this.progress = 100
      this.snackbarFlag = false

      this.interval = setInterval(() => {
        this.progress -= 1
      }, 10)
    },
  },

}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
.v-list--dense .v-list-item {
  min-height: 24px;
}
</style>

<style lang="scss">
.v-input__slot {
  margin: 0;
}
</style>
