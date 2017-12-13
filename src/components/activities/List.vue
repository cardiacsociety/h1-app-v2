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

        <v-card flat v-for="(activity, index) in displayActivities" :key="index">
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

        <div id="load-more" class="scroll-watcher">loading more... {{ listCount }}</div>
    </div>
</template>


<script>
    import ScrollMonitor from 'scrollmonitor'
    import {EventBus} from '../../main';
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
                listCount: 5, // start with 5 on screen
                overlay: false,
            }
        },

        computed: {
            activities() {
                return this.$store.state.memberActivities
            },
            activityTypes() {
                return this.$store.state.activityTypes
            },
            displayActivities() {
                return this.activities.slice(0, this.listCount)
            }
        },

        methods: {
            loadMore() {
                this.overlay = true
                this.listCount += 5
                this.overlay = false
            }
        },

        mounted() {

            // load more
            let elem = document.getElementById('load-more')
            let watcher = scrollMonitor.create(elem)
            watcher.enterViewport(() => {
                this.loadMore()
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
    .scroll-watcher {
        background-color: yellow
    }
</style>