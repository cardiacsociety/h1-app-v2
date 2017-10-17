<template>
    <div>
        {{ checkAuth('activitiesList') }}
        <app-overlay v-if="overlay"></app-overlay>
        <app-add-fab></app-add-fab>
        <h1>Activity List</h1>
        <div v-for="activity in activities">
            <router-link :to="{name: 'activityDetail', params: {id: activity.id}}">
                {{ activity.date }} - {{ activity.activityName }}
            </router-link>
        </div>
    </div>
</template>


<script>
  import Overlay from '../Overlay.vue'
  import AddFab from './AddFab.vue'

  export default {

    components: {
      appOverlay: Overlay,
      appAddFab: AddFab
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
                activityDescription: e.activity.description
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
    }
  }
</script>

<style>

</style>