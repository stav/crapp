<template>
  <v-expansion-panel>
    <!-- HEADER -->
    <v-expansion-panel-header color="primary" class="text-h6">
      <span
        v-if="statementLoaded"
        class="d-inline-block text-truncate"
        style="width: 120px"
      > Statement </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="primary">
      <pre>{{ statement }}</pre>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  computed: {
    statement () {
      return this.$store.state.statement
    },
    statementLoaded () {
      return !!Object.entries(this.statement).length
    },
  }
}
</script>
