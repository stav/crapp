<template>
  <v-data-table
    :headers="headers"
    :items="repositorys"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title> Repositories </v-toolbar-title>
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
import Repository from '@/models/Repository'
import repositorys from '@/data/repositorys'

export default {

  async fetch () {
    if (process.server) {
      // Repository.create({ data: repos, insert: ['coins'] })
      Repository.create({ data: await repositorys() })
    }
  },

  data: () => ({
    headers: [
      { text: 'Id'     , value: 'id'     }, // eslint-disable-line no-multi-spaces, comma-spacing
      { text: 'Name'   , value: 'name'   }, // eslint-disable-line no-multi-spaces, comma-spacing
      { text: 'Active' , value: 'active' }, // eslint-disable-line no-multi-spaces, comma-spacing
      { text: 'Coins'  , value: 'coins'  }, // eslint-disable-line no-multi-spaces, comma-spacing
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
