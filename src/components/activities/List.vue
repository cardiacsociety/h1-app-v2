<template>
    <div>
        <app-overlay v-if="overlay"></app-overlay>
        <app-activity-form>
            <app-add-fab slot="activator"></app-add-fab>
        </app-activity-form>
        <h3>Activity List</h3>
        <v-card v-for="activity in activities">
            <v-card-title>
                <div>
                    <span class="grey--text">{{ activity.date }}</span><br>
                    <span class="body-2">{{ activity.activityName }}</span><br>
                    <span class="body-1">{{ activity.description }}</span>
                </div>
            </v-card-title>
            <!--<router-link :to="{name: 'activityDetail', params: {id: activity.id}}">-->
                <!--{{ activity.date }} - {{ activity.activityName }}-->
            <!--</router-link>-->
        </v-card>
    </div>
</template>


<script>
  import Overlay from '../Overlay.vue'
  import AddFab from './AddFab.vue'
  import ActivityForm from '../activities/ActivityForm.vue'

  export default {

    components: {
      appOverlay: Overlay,
      appAddFab: AddFab,
      appActivityForm: ActivityForm
    },

    data() {
      return {
        overlay: false,
        activities: []
      }
    },

    mounted() {
      this.fetch()
    },

    methods: {
      fetch() {
        this.overlay = true
        this.$http.get('m/activities')
          .then(r => {
            r.body.data.forEach(e => {
              this.activities.push({
                id: e.activity.id,
                date: e.date,
                categoryName: e.category.name,
                activityName: e.activity.name,
                description: e.description
              })
            })
            console.log(r)
            this.store()
            this.overlay = false
          }, r => {
            console.log(r)
            // If 401 then need to login
            this.overlay = false
          })
      },

      // Store the activities in localstorage (testing)
      store() {
        this.$localStorage.set('appActivities', JSON.stringify(this.activities))
      }
    },
  }
</script>

<style>

</style>