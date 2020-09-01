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
    <!--
    <template v-if="repositorys.length" v-slot:body.append>
      <tr>
        <td v-for="header of headers" :key="header.value">
          <span v-if="header.value==='coins'" v-text="header" />
        </td>
      </tr>
      <tr>
        <td :colspan="headers.length">
          {{ coins }}
          <ul> <li v-for="(coin, i) in coins" :key="i" v-text="coin" /> </ul>
          <ul> <li v-for="(coin, i) in coins" :key="i" v-text="coin.symbol" /> </ul>
        </td>
      </tr>
    </template>
    -->
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

  computed: {
    repositorys () {
      const _ = this.$store.$db().model('repositorys').query().with('coins').get()
      return _.map((repo) => {
        const coins = {}
        for (const coin of repo.coins) {
          coins[coin.symbol] = coin.quantity
        }
        return Object.assign(repo, coins)
      })
    },
    headers () {
      const _ = [
        { text: 'Id'     , value: 'id'     }, // eslint-disable-line no-multi-spaces, comma-spacing
        { text: 'Name'   , value: 'name'   }, // eslint-disable-line no-multi-spaces, comma-spacing
        { text: 'Actions', value: 'actions', sortable: false },
      ]
      for (const coin of this.coins) {
        _.push({ text: coin, value: coin })
      }
      return _
    },
    coins () {
      const coins = this.$store.$db().model('coins').all()
      const uniqueCoins = new Set(coins.map(coin => coin.symbol))
      const sortedUniqueCoins = Array.from(uniqueCoins).sort()
      return sortedUniqueCoins
    },
  },

}
</script>
