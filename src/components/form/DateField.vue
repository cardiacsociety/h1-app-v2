<template>
    <v-menu
            lazy
            :close-on-content-click="true"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
    >
        <v-text-field
                slot="activator"
                label="Date"
                v-model="date"
                prepend-icon="event"
                readonly
                required
                :rules="dateRules"
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable>
            <!--<v-date-picker v-model="date" no-title scrollable actions>-->
            <!--<template slot-scope="{ save, cancel }">-->
            <!--<v-card-actions>-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-btn flat color="primary" @click="cancel">Cancel</v-btn>-->
            <!--<v-btn flat color="primary" @click="save">OK</v-btn>-->
            <!--</v-card-actions>-->
            <!--</template>-->
        </v-date-picker>
    </v-menu>
</template>

<script>
  import moment from 'moment'

  export default {

    props: {

      // pass in a method so this component can set a value in the parent
      handleSetDate: {
        type: Function,
        required: true
      },

      // pass this in from the parent so the date doesn't get reset on page reload
      initialDateValue: {
        type: String,
        default: null
      },
    },

    data: () => ({
      date: null,
      menu: false,
      modal: false,
      dateRules: [
        v => !!v || "Required"
      ]
    }),

    watch: {
      date(v) {
        this.handleSetDate(v)
      }
    },

    mounted() {
      this.$nextTick(() => {

        if (this.initialDateValue) {
          this.date = this.initialDateValue
        }

        // set the text input to today as a default
        if (this.date === null) {
          this.date = moment().format("YYYY-MM-DD")
        }

        // call the handler to set the date in the parent
        this.handleSetDate(this.date)
      })
    }
  }
</script>

<style>
</style>