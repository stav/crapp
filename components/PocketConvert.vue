<template>
  <div>
    <v-input hide-details>
      <v-text-field
        v-model="convert"
        :rules="[rules.numeric]"
        placeholder="1.5"
        hide-details
        clearable
        outlined
        dense
      />
    </v-input>
    <div class="ml-4 mt-2" v-show="convert" v-text="convertedUSD" />
  </div>
</template>

<script>
import { formatCurrency } from '@/utils'

export default {

  /*
  ** PROPS
  */
  props: {
    symbol: {
      type: String,
      required: true,
      default() {
        return ''
      },
    },
  },

  /*
  ** DATA
  */
  data () {
    return {
      convert: null,
      rules: {
        numeric: n => `${n}`.length > 0 || (!isNaN(parseFloat(n)) && isFinite(n)),
      },
    }
  },

  /*
  ** COMPUTED
  */
  computed: {
    coinPriceAmount () {
      return this.$store.getters.coinPriceUSD(this.symbol)
    },
    convertedUSD () {
      return 'USD ' + formatCurrency(this.convert * this.coinPriceAmount)
    },
  },

}
</script>
