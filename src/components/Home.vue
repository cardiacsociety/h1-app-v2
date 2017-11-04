<template>
    <v-layout row wrap>
        <v-flex md12 lg4>
            <v-btn v-on:click="addActivity">add activity</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
  import api from '../api/mapp'

  export default {

    data () {
      return {
        picker: null
      }
    },

    methods: {
      addActivity() {
        api.addActivity({})
      }
    }
  }
</script>

<style>
</style>