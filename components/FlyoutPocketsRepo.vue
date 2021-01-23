<template>
  <v-expansion-panels multiple accordion hover v-model="repoPockets">
    <!-- COINS -->
    <v-expansion-panel>
      <v-expansion-panel-header color="primary">
        Coins
      </v-expansion-panel-header>
      <v-expansion-panel-content color="primary">
        <pocket-coins :coins="repository.coins" />
      </v-expansion-panel-content>
    </v-expansion-panel>

    <!-- TRANSACTIONS -->
    <v-expansion-panel>
      <v-expansion-panel-header color="secondary">
        Transactions
      </v-expansion-panel-header>
      <v-expansion-panel-content color="secondary">
        <pocket-trans :trans="repository.transactions" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import PocketCoins from './PocketCoins.vue'
import PocketTrans from './PocketTrans.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'pocket-coins': PocketCoins,
    'pocket-trans': PocketTrans,
  },

  /*
  ** PROPS
  */
  props: {
    repository: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },

  /*
  ** COMPUTED
  */
  computed: {
    repoPockets: {
      get () {
        return this.$store.state.repoPockets
      },
      set (value) {
        this.$store.commit('setRepoPockets', value)
      }
    },
  },

}
</script>
