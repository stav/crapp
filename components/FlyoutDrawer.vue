<template>
  <v-navigation-drawer app right ref="flyoutDrawer" v-model="flyoutDrawer" :clipped="true" :width="navigation.width">
    <v-expansion-panels multiple hover v-model="flyoutPanels">
      <flyout-panel-coin />
      <flyout-panel-repo />
      <flyout-panel-stmt />
      <flyout-panel-util />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import flyoutPanelCoin from '@/components/FlyoutPanelCoin.vue'
import flyoutPanelRepo from '@/components/FlyoutPanelRepo.vue'
import flyoutPanelStmt from '@/components/FlyoutPanelStmt.vue'
import flyoutPanelUtil from '@/components/FlyoutPanelUtil.vue'

export default {

  components: {
    'flyout-panel-coin': flyoutPanelCoin,
    'flyout-panel-repo': flyoutPanelRepo,
    'flyout-panel-stmt': flyoutPanelStmt,
    'flyout-panel-util': flyoutPanelUtil,
  },

  data: () => ({
    navigation: {
      width: 300,
      borderSize: 10,
    },
  }),

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

  mounted() {
    // https://stackoverflow.com/questions/55261712/vuetify-navigation-drawer-drag-to-resize#answer-55262211
    this.setBorderWidth()
    this.setEvents()
    setTimeout(() => { this.flyoutDrawer = false }, 1000)
  },

  methods: {
    setBorderWidth() {
      const i = this.$refs.flyoutDrawer.$el.querySelector('.v-navigation-drawer__border')
      i.style.width = this.navigation.borderSize + 'px'
      i.style.cursor = 'ew-resize'
    },
    setEvents() {
      const minSize = this.navigation.borderSize
      const el = this.$refs.flyoutDrawer.$el
      const drawerBorder = el.querySelector('.v-navigation-drawer__border')
      const direction = el.classList.contains('v-navigation-drawer--right') ? 'right' : 'left'

      function resize(e) {
        document.body.style.cursor = 'ew-resize'
        const f = direction === 'right'
          ? document.body.scrollWidth - e.clientX
          : e.clientX
        el.style.width = f + 'px'
      }

      drawerBorder.addEventListener(
        'mousedown',
        (e) => {
          if (e.offsetX < minSize) {
            el.style.transition = 'initial'
            document.addEventListener('mousemove', resize, false)
          }
        },
        false
      )

      document.addEventListener(
        'mouseup',
        () => {
          el.style.transition = ''
          this.navigation.width = el.style.width
          document.body.style.cursor = ''
          document.removeEventListener('mousemove', resize, false)
        },
        false
      )
    }
  },

}
</script>
