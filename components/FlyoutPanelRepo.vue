<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="text-h6">
      {{ repository.name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list>
        <v-list-item v-for="coin of repository.coins" :key="coin.id" class="accent">
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
  computed: {
    repository () {
      const model = this.$store.$db().model('repositorys')
      const repos = model.query().with('coins')
      const repoId = this.$store.state.flyoutRepoId
      const repo = repos.where('id', repoId).first()
      return repo || {}
    }
  }
}
</script>
