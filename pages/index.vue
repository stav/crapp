<template>
  <div>
    <h2 class="brown--text text--darken"> CrApp, the crypto app.</h2>
    <v-btn
      to="/repos"
      router
      exact
    >
      Click me
    </v-btn>
  </div>
</template>

<script>
export default {

  mounted () {
    console.log('asdf', this)
    this.$notify(
      { group: "foo", title: "Success", text: "Your account was registered!" },
      2000
    ) // 2s
  }

}
</script>
