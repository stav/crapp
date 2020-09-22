<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6">
      {{ name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-progress-linear
        absolute top color="deep-purple accent-4"
        :active="loading"
        :indeterminate="true"
      />
      <v-list>
        <v-list-item v-for="coin of coins" :key="coin.id" class="accent">
          <v-list-item-content>
            <v-list-item-subtitle v-text="coin.name" class="text--disabled" />
            <v-list-item-title v-text="coin.symbol" class="text-h4" />
            <v-list-item-title v-text="coin.quantity" class="text--secondary text-h5" />
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
      default: () => [],
    },
    name: {
      type: String,
      default: '[Repox]',
    },
  },

  data: () => ({
    loading: false,
  }),

  computed: {
  },

  methods: {
  },

}
</script>
