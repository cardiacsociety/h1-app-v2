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
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable actions>
            <template slot-scope="{ save, cancel }">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                    <v-btn flat color="primary" @click="save">OK</v-btn>
                </v-card-actions>
            </template>
        </v-date-picker>
    </v-menu>
</template>

<script>
  import moment from 'moment'

  export default {

    data: () => ({
      date: null,
      menu: false,
      modal: false
    }),

    mounted() {
      // set the text input to today as a default
      if (this.date === null) {
        this.date = moment().format("YYYY-MM-DD")
      }
    }
  }
</script>

<style>
</style>