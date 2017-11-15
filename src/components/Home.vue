<template>
    <v-layout row wrap>
        <v-flex md12 lg4>
            <app-activity-form
                :activityData="activity"
                >
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
        activity: {
          date: "2000-01-01",
          description: "tes tes test ",
          activityId: 2, // type
          quantity: 10,
        }
      }
    },

    methods: {
    }
  }
</script>

<style>
</style>