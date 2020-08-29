<template>
  <v-data-table
    :headers="headers"
    :items="repositorys"
    sort-by="transDate"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
      </v-toolbar>
    </template>

    <template v-slot:item.coins="{ item, header, value }">
      {{ value.map(coin => coin.name).join(',') }}
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import Coin from '@/models/Coin'
  import Repository from '@/models/Repository'
  import repositorys from '@/data/repositorys'

  export default {

    async fetch () {
      if (process.server) {
        for (const repository of await repositorys()) {
          const coins = repository.coins || []
          repository.coins = coins.map(coin => Object.assign(coin, { name: coin.symbol }))
          Repository.insert({ data: repository })
        }
      }
    },

    data: () => ({
      headers: [
        { text: 'Id'     , value: 'id'     },
        { text: 'Name'   , value: 'name'   },
        { text: 'Active' , value: 'active' },
        { text: 'Coins'  , value: 'coins'  },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }),

    computed: {
      repositorys () {
        return this.$store.$db().model('repositorys').query().with('coins').get()
      },
    },

  }
</script>
