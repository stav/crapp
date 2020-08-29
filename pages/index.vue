<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <repos />
    </v-flex>
  </v-layout>
</template>

<script>
import Repos from '~/components/Repos'

export default {
  components: {
    Repos,
  }
}
</script>
