<template>
  <v-card class="mx-auto">
    <v-app-bar color="blue darken-4">
      <v-icon class="mr-2">mdi-script-text-outline</v-icon>
      Transactions
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search coins"
        hide-details
        single-line
        clearable
      />
    </v-app-bar>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="trans"
      :items-per-page="trans.length"
      :sort-desc="true"
      sort-by="timestamp"
    >
      <template v-slot:item.timestamp="{ item }">
        {{ item.timestring }}
      </template>
      <template v-slot:item.coin.symbol="{ item }">
        <v-btn @click="search = item.coin.symbol">
          {{ item.coin.symbol }}
        </v-btn>
      </template>
      <template v-slot:item.quantity="{ item }">
        {{ formatAmount(item.quantity) }}
      </template>
      <template v-slot:item.fee="{ item }">
        {{ formatAmount(item.fee) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { formatAmount } from '@/utils'

export default {

  /*
  ** FETCH
  */
  async fetch () {
    await this.$store.dispatch('loadRepositorys')
  },

  /*
  ** DATA
  */
  data: () => ({
    search: '',
    headers: [
      { text: 'Date', value: 'timestamp', filter: _ => true },
      { text: 'Type', value: 'type', filter: _ => true },
      { text: 'Quantity', value: 'quantity', align: 'end', filter: _ => true },
      { text: 'Coin', value: 'coin.symbol' },
      { text: 'Repo', value: 'repo.name', filter: _ => true },
      { text: 'Fee', value: 'fee', filter: _ => true },
      { text: 'Note', value: 'note', filter: _ => true },
    ],
  }),

  /*
  ** COMPUTED
  */
  computed: {
    trans () {
      return this.$store.getters.transactions
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
