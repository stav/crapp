<template>
  <v-card class="mx-auto">
    <v-card-text class="accent px-0">
      <v-list dense v-if="trans" class="px-1">
        <v-list-item
          v-for="tran of localTransactions" :key="tran.id"
          @click="() => flyCoin(tran.symbol)"
          class="px-0 pb-4 accent"
          :title="tran.timestring + '\n' + tran.note"
        >
          <v-list-item-icon class="mr-4">
            <coin-logo
              :symbol="tran.symbol"
              :quantity="formatAmount(tran.quantity)"
              :color="tran.quantity > 0 ? 'green' : 'red'"
            />
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-list-item-title v-text="tran.symbol" />
            <v-chip x-small pill class="px-1" color="orange darken-4"> {{ tran.age }} days ago </v-chip>
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
  ** COMPUTED
  */
  computed: {
    localTransactions () {
      console.log('local', this.trans)
      return [...this.trans]
        .map(tran => Object.assign({}, tran, { age: this.age(tran) })) // add age
        .sort((a, b) => a.timestamp - b.timestamp) // sort by timestamp
    },
  },

  /*
  ** METHODS
  */
  methods: {
    formatAmount (value) {
      return formatAmount(value)
    },
    flyCoin (symbol) {
      this.$store.dispatch('flyCoin', symbol)
    },
    age (transaction) {
      return parseInt((new Date().getTime() - transaction.timestamp) / 1000 / 24 / 60 / 60)
    },
  },

}
</script>
