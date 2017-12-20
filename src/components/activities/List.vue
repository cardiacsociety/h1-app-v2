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

        <!--<div id="loadfirst">-->
            <!--<div v-if="moreToShow">loading activities...</div>-->
        <!--</div>-->

        Total: {{ total }}<br>
        More to show? {{ moreToShow }}<br>
        Show (max): {{ show }}


        <!--<div id="load-more-top">-->
            <!--<div v-if="showLoading">-->
                <!--<v-progress-circular indeterminate color="primary"></v-progress-circular>-->
                <!--Loading-->
            <!--</div>-->
            <!--<div v-else>-->
                <!--start of data-->
            <!--</div>-->
        <!--</div>-->

        <v-card flat v-for="(activity, index) in activities.slice(0, show)" :key="index">

            <v-card-title>
                <div>
                    {{ index }}
                    <span class="grey--text">{{activity.date }} - qty: {{ activity.quantity }} - {{ activity.categoryName }}</span><br>
                    <span class="body-2">{{ activity.activityName }} <span
                            class="grey--text">(id {{ activity.typeId }})</span></span><br>
                    <span class="body-1">{{ activity.description }} <span
                            class="grey--text">(id {{ activity.id }})</span></span>
                </div>
            </v-card-title>
            <v-card-actions>
                <app-activity-form
                        :index="index"
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

        <div id="loadmore">
            <div v-if="moreToShow">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                loading
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
                show: 5,
                loadMoreCount: 5,
                overlay: false,
            }
        },

        computed: {
            // all activities
            activities() {
                return this.$store.state.memberActivities
            },
            total() {
                return this.activities.length
            },
            // listLength() {
            //   return this.currentListCount + this.loadMoreCount
            // },
            addToListCount() {
              if (this.moreToShow) {
                  let addToList = this.currentListCount + this.loadMoreCount
                  return  addToList < this.total ? addToList : this.total
              }
            },
            activityTypes() {
                return this.$store.state.activityTypes
            },
            moreToShow() {
                if (this.total <= this.show) {
                    return false
                }
                return true
            }
        },

        methods: {

            loadMore() {
                this.show += this.loadMoreCount
            },
        },

        mounted() {

            // reset show
            //this.show = this.initialShow

            // This first loop is for when the page first loads and the 'loadmore'
            // element is in the viewport. .isInViewport is triggered (once) and
            // .enterViewport is triggered once. If both of these do not load enough activities
            // to push the 'loadmore' element out of the viewport then .enterViewport cannot be triggered
            // and no new items are displayed. As a workaround a loop will run until all the items are
            // displayed, or until the 'loadmore' element is pushed out of the view port.
            let e = document.getElementById('loadmore')
            let w = ScrollMonitor.create(e)
            // for (let i = 0; i < this.total; i++) {
            //     if (w.isInViewport) {
            //         this.loadMore()
            //         console.log("loadmore triggered by 'in viewport' - show " + this.show)
            //     } else {
            //         console.log("out of viewport")
            //         break
            //     }
            // }

            w.enterViewport(() => {
                if (this.show < this.total) {
                    this.loadMore()
                    console.log("loadmore triggered by 'enter viewport' - showing max " + this.show + " of " + this.total)
                } else {
                    console.log("loadmore triggered by 'enter viewport' - already maxed!")
                }
            })



            // listen for request to update screen, eg after an item is edited
            EventBus.$on('updatedActivity', (index) => {
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
    .just-updated {
        background-color: paleturquoise;
    }
</style>