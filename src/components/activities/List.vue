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

        <!--<div id="load-more-top">-->
            <!--<div v-if="showLoading">-->
                <!--<v-progress-circular indeterminate color="primary"></v-progress-circular>-->
                <!--Loading-->
            <!--</div>-->
            <!--<div v-else>-->
                <!--start of data-->
            <!--</div>-->
        <!--</div>-->

        <v-card flat v-for="(activity, index) in activitiesList" :key="index">
            {{ incCounter() }}
            <v-card-title>
                <div>
                    <span class="grey--text">{{activity.date }} - qty: {{ activity.quantity }} - {{ activity.categoryName }}</span><br>
                    <span class="body-2">{{ activity.activityName }} <span
                            class="grey--text">(id {{ activity.typeId }})</span></span><br>
                    <span class="body-1">{{ activity.description }} <span
                            class="grey--text">(id {{ activity.id }})</span></span>
                </div>
            </v-card-title>
            <v-card-actions>
                <app-activity-form
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

        <div id="load-more-bottom">
            <div v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                Loading
            </div>
            <div v-else>
                end of data
            </div>
        </div>
    </div>
</template>


<script>
    import ScrollMonitor from 'scrollmonitor'
    import {EventBus} from '../../main'
    import Overlay from '../Overlay.vue'
    import AddFab from './AddFab.vue'
    import ActivityForm from '../activities/ActivityForm.vue'

    export default {

        components: {
            appOverlay: Overlay,
            appAddFab: AddFab,
            appActivityForm: ActivityForm,
        },

        data() {
            return {
                // The activities being displayed
                //activitiesList: [],

                // start and end indices, and number to shift on or off
                activitiesStartIndex: 0,
                activitiesEndIndex: 0,
                activitiesShowCount: 20,

                // Show the loading spinner
                loading: false,
                overlay: false,
            }
        },

        computed: {
            activities() {
                return this.$store.state.memberActivities
            },
            activitiesList() {
                return this.activities.slice(this.activitiesStartIndex, this.activitiesEndIndex)
            },
            maxIndex() {
                return this.activities.length - 1
            },
            activityTypes() {
                return this.$store.state.activityTypes
            },
        },

        methods: {

            // loadMore determines the set of activities that should be displayed on screen. It is like moving window
            // that keeps the total number of DOM nodes that get renders to a reasonable amount. Otherwise, the
            // infinite scrolling if lots of activities starts to really slow things down - this is because of the
            // form component loaded with each activity row.
            shiftTop() {
                let newStartIndex = this.activitiesStartIndex - this.activitiesShowCount
                this.activitiesStartIndex = newStartIndex > 0 ? newStartIndex : 0
                this.activitiesEndIndex = this.activitiesStartIndex + this.activitiesShowCount
                console.log(`shiftTop has set [${this.activitiesStartIndex}, ${this.activitiesEndIndex}]`)
            },

            shiftBottom() {
                let newEndIndex = this.activitiesEndIndex + this.activitiesShowCount
                this.activitiesEndIndex = newEndIndex < this.maxIndex ? newEndIndex : this.maxIndex
                //this.activitiesStartIndex = this.activitiesEndIndex - this.activitiesShowCount
                console.log(`shiftBottom has set [${this.activitiesStartIndex}, ${this.activitiesEndIndex}]`)
            },

            incCounter() {
                console.log("loop - [" + this.activitiesStartIndex + ", " + this.activitiesEndIndex + "]")
            }


        },

        mounted() {

            // watch top and bottom
            //let elemTop = document.getElementById('load-more-top')
            //let watcherTop = scrollMonitor.create(elemTop)
            let elemBottom = document.getElementById('load-more-bottom')
            let watcherBottom = scrollMonitor.create(elemBottom)

            // Whenever the top is visible need to either append items, until the bottom is off screen,
            // or prepend items, until the top is offscreen, or we are at the start
            // watcherTop.enterViewport(() => {
            //     // console.log("top")
            //     //     this.shiftTop()
            // })

            // Whenever the bottom is visible, and there are more items, load them
            watcherBottom.enterViewport(() => {
                console.log("bottom")
                this.loading = true
                this.shiftBottom()
            })

            // listen for request to update screen, eg after an item is edited
            EventBus.$on('updatedActivity', (activity, index) => {
                console.log("Updating the activity at index " + index)
            })

            EventBus.$on('addedActivity', (activity) => {
                console.log("A new activity was added... add to local list")
                this.activities.unshift(activity) // prepend the new activity
            })

            // setTimeout(() => {
            //     this.$store.commit("setMemberActivity", {id: 666, date: "2017-12-25", description: "The Beast"})
            // }, 3000)
            // setInterval(() => {
            //     this.n++
            // }, 1000)


        },

    }
</script>

<style scoped>
    .card__title {
        padding-bottom: 0;
    }

    #load-more-top {
        background-color: red;
    }

    #load-more-bottom {
        background-color: green;
    }


</style>