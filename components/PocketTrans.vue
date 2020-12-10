<template>
  <v-card class="mx-auto">
    <v-card-text class="accent px-0">
      <v-list dense v-if="trans" class="px-1">
        <v-list-item
          v-for="tran of trans" :key="tran.id"
          class="px-0 pb-4 accent"
          :title="tran.note"
        >
          <v-list-item-icon class="mr-4">
            <coin-logo :symbol="tran.symbol" :quantity="formatAmount(tran.quantity)" />
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-list-item-title v-text="tran.symbol" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <h3 v-if="!trans"> Select a repository by clicking on it. </h3>
    </v-card-text>
  </v-card>
</template>

<script>
import { formatAmount } from '@/utils'
import coinLogo from '~/components/CoinLogo.vue'

export default {

  /*
  ** COMPONENTS
  */
  components: {
    'coin-logo': coinLogo,
  },

  /*
  ** PROPS
  */
  props: {
    trans: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  /*
  ** METHODS
  */
  methods: {
    formatAmount (value) {
      return formatAmount(value)
    },
  },

}
</script>
