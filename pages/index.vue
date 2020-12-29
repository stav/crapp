<template>
  <div>
    <h2 class="brown--text text--darken"> CrApp, the crypto app.</h2>
    <v-btn exact nuxt router to="/repos"> Click me </v-btn>
    <v-btn @click="balance()"> Kraken Balance </v-btn>
  </div>
</template>

<script>
export default {

  methods: {
    async balance () {
      const response = await fetch('/api/kraken/balance')
      const json = await response.json()
      console.log(json)
    }
  }

}
</script>
