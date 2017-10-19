<template>
    <div>
        <h1>TEST</h1>

        <div>
            <v-btn v-on:click="testAuth">Test Auth</v-btn>
            <p>{{ token }}</p>
        </div>

        <div>
            <v-btn v-on:click="fetchActivityTypes">fetch activity types</v-btn>
            <p>{{ activityTypes }}</p>
        </div>
    </div>


</template>

<script>
    import api from '../../api/mapp'

    export default {

      data() {
        return {
            token: '',
            activityTypes: []
        }
      },

      methods: {
        testAuth() {
          api.auth('member@mappcpd.com', 'demoMember1')
            .then((t) => {
                this.token = t
            })
            .catch(() => {
                console.log("Authentication error")
            })
        },
        fetchActivityTypes() {
          this.activityTypes = api.getActivityTypes()
        }
      }
    }
</script>

<style>

</style>