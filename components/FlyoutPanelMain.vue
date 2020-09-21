<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6"> 
      {{ name }} 
      <v-progress-linear
        absolute top color="deep-purple accent-4"
        :active="loading"
        :indeterminate="true"
      ></v-progress-linear>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {

  props: {
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
