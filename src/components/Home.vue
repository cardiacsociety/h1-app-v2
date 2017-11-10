<template>
    <v-layout row wrap>
        <v-flex md12 lg4>
            <app-activity-form>
                <v-btn slot="activator">add activity</v-btn>
            </app-activity-form>
        </v-flex>
    </v-layout>
</template>

<script>
  import ActivityForm from './activities/ActivityForm.vue'

  export default {

    components: {
      appActivityForm: ActivityForm
    },

    data () {
      return {
      }
    },

    methods: {
    }
  }
</script>

<style>
</style>