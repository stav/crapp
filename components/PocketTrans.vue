<template>
  <v-card class="mx-auto">
    <v-card-text class="accent">
      <v-list v-if="trans" class="pa-0">
        <v-list-item
          v-for="tran of trans" :key="tran.id"
          class="pl-0 pb-4 accent"
        >
          <v-list-item-content class="pa-0">
            <v-container class="pa-0">
              <v-row no-gutters style="flex-wrap: nowrap;">
                <v-col class="flex-grow-0 flex-shrink-1">
                  <code v-text="tran.symbol" />
                </v-col>
                <v-col class="flex-grow-1 flex-shrink-1 align-end pl-2">
                  <v-list-item-subtitle class="text--disabled" v-text="tran.name" />
                </v-col>
              </v-row>
            </v-container>
            <v-list-item-title v-text="tran.quantity" class="text-h5" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <h3 v-if="!trans"> Select a repository by clicking on it. </h3>
    </v-card-text>
  </v-card>
</template>

<script>
export default {

  /*
  ** PROPS
  */
  props: {
    trans: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

}
</script>
