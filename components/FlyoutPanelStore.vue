<template>
  <v-expansion-panel>
    <v-expansion-panel-header> Store </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list>
        <v-list-item v-for="coin of coins" :key="coin.id" class="accent">
          <v-list-item-content>
            <v-list-item-subtitle v-text="coin.name" class="text--disabled" />
            <v-list-item-title v-text="coin.symbol" class="text-h4" />
            <v-list-item-title v-text="coin.quantity" :title="`${name} store has ${coin.quantity} ${coin.symbol}`" class="text--secondary text-h5" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {

  props: {
    coins: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
      default: '[Repox]',
    },
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
  },

}
</script>
