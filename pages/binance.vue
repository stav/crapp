<template>
  <v-layout>
    <v-card :loading="loading" class="mx-auto">
      <v-app-bar>
        <v-img
          :src="require('@/assets/logos-download.com/Binance_logo_coin.png')"
          max-width="27px"
        />
        <v-toolbar-title class="mx-2">
          Binance
        </v-toolbar-title>
        <v-spacer />
        <v-btn title="Clear" @click="clear"> X </v-btn>
        <v-btn @click="() => fetch('system.status')" color="secondary" title="Check the system status"> Status </v-btn>
        <v-btn @click="() => fetch('time')" color="secondary" title="Query server time"> Time </v-btn>
        <v-btn @click="() => fetch('account')" color="primary" title="Fetch account information"> Account </v-btn>
      </v-app-bar>
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <json-view :data="result" />
          </v-col>
          <v-col
            v-for="(balance, i) in balances"
            :key="i"
          >
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-btn x-large block>
                  <v-card-subtitle
                    class="mx-0 px-0"
                    v-text="balance.free"
                  />
                  <v-card-title
                    class="headline mx-0 pl-1"
                    v-text="balance.asset"
                  />
                  <v-card-subtitle
                    class="mx-0 pa-0"
                    v-if="balance.locked"
                    v-text="`${balance.locked} locked`"
                  />
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script>
import { JSONView } from 'vue-json-component'

export default {

  components: { 'json-view': JSONView },

  data () {
    return {
      result: {},
      loading: false,
    }
  },

  computed: {
    balances () {
      if (
        this.result &&
        this.result.balances
      ) {
        return this.result.balances
          .filter(balance => parseFloat(balance.free) || parseFloat(balance.locked))
          .map(balance => Object.assign(balance, { locked: parseFloat(balance.locked) }))
      } else {
        return []
      }
    }
  },

  methods: {
    clear () {
      this.result = {}
    },
    async fetch (resource) {
      this.loading = true
      const response = await fetch('/api/binance/' + resource)
      this.result = response.status === 200 ? await response.json() : { status: response.status }
      this.loading = false
    },
  },
}
</script>
