<template>
  <v-footer app :absolute="!absolute">
    <span>&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
  props: {
    absolute: Boolean,
  }
}
</script>
