<template>
    <div>
        <app-overlay v-if="overlay"></app-overlay>
        <app-activity-form
                :activityTypesData="activityTypes"
                :reset="true"
        >
            <app-add-fab
                    slot="activator"
            ></app-add-fab>
        </app-activity-form>
        <h3>Activity List</h3>

        <v-card flat v-for="(activity, index) in activities" :key="index">
            <v-card-title>
                <div>
                    <span class="grey--text">{{ activity.date }}</span><br>
                    <span class="grey--text">qty: {{ activity.quantity }}</span><br>
                    <span class="grey--text">cat: {{ activity.categoryName }}</span><br>
                    <span class="grey--text">typeID: {{ activity.typeId }}</span><br>
                    <span class="grey--text">ID: {{ activity.id }}</span><br>
                    <span class="body-2">{{ activity.activityName }}</span><br>
                    <span class="body-1">{{ activity.description }}</span>
                </div>
            </v-card-title>
            <v-card-actions>
                <app-activity-form
                        :activityTypesData="activityTypes"
                        :activityData="{
                          id: activity.id,
                          typeId: activity.typeId,
                          date: activity.date,
                          quantity: activity.quantity,
                          description: activity.description,
                        }"
                >
                    <v-btn icon ripple slot="activator">
                        <v-icon color="orange darken-2">edit</v-icon>
                    </v-btn>
                </app-activity-form>
                <!--<v-btn icon ripple>-->
                <!--<v-icon>attachment</v-icon>-->
                <!--</v-btn>-->
            </v-card-actions>
            <v-divider></v-divider>
        </v-card>

    </div>
</template>


<script>
    import {EventBus} from "../../main";
    import api from '../../api/mapp'
    import graphql from '../../api/graphql'
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
                activities: [],

                // list of activity types get passed to form as props.
                activityTypes: []
            }
        },

        methods: {
            fetchUserActivities() {
                this.overlay = true
                graphql.getMemberActivities()
                    .then(data => {
                        let activities = data.memberUser.activities
                        activities.forEach((v) => {
                            this.activities.push({
                                id: v.id,
                                date: v.date,
                                description: v.description,
                                quantity: v.credit,
                                typeId: v.typeId,
                                activityName: v.type,
                                categoryName: v.category,
                            })
                        })
                        this.overlay = false
                    }, r => {
                        console.log(r)
                        // If 401 then need to login
                        this.overlay = false
                    })
            },

            fetchActivityTypes() {
                api.getActivityTypes()
                    .then(r => {
                        r.body.data.forEach(e => {
                            this.activityTypes.push({
                                id: e.id,
                                name: e.name,
                                unit: e.credit.unitName
                            })
                        })
                    }, r => {
                        console.log("Error fetching activity types", r)
                    })
            },

        },

        // Store the activities in localstorage (testing)
        // store() {
        //   this.$localStorage.set('appActivities', JSON.stringify(this.activities))
        // }

        mounted() {
            this.fetchUserActivities()
            this.fetchActivityTypes()

            // listen for request to update screen, eg after an item is edited
            EventBus.$on('updatedActivity', (activity, index) => {
                console.log("Updating the activity at index " + index)
                //this.fetchUserActivities()
                //this.$forceUpdate()
            })

            EventBus.$on('addedActivity', (activity) => {
                console.log("A new activity was added... add to local list")
                this.activities.unshift(activity) // prepend the new activity
            })

        },

    }
</script>

<style scoped>
    .card__title {
        padding-bottom: 0;
    }
</style>