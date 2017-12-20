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

        Total activities: {{ total }}

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
                show: 10,
                loadMoreCount: 10,
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
            let e = document.getElementById('loadmore')
            let w = ScrollMonitor.create(e)
            w.enterViewport(() => {
                if (this.show < this.total) {
                    this.loadMore()

                }
            })
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