<template>
    <div>
        <app-activity-form :reset="true">
            <app-add-fab slot="activator"></app-add-fab>
        </app-activity-form>
        <h3>Activities Overview</h3>
        <div>
            <div>CPD Progress</div>
            <v-progress-circular
                    v-bind:size="120"
                    v-bind:width="15"
                    v-bind:rotate="360"
                    v-bind:value="progressPercentage"
                    color="deep-orange"
            >
                {{ progressPercentage }}%
            </v-progress-circular>
        </div>
        <div>
            <v-list>
                <app-activity-form :reset="true">
                    <app-nav-drawer-link icon="library_add" slot="activator">
                        Add a new activity
                    </app-nav-drawer-link>
                </app-activity-form>
                <app-nav-drawer-link
                        icon="history"
                        :to="{name: 'activitiesList'}"
                >View a list of past activities
                </app-nav-drawer-link>
            </v-list>
        </div>
    </div>
</template>

<script>
    import NavDrawerLink from '../nav/NavDrawerLink.vue'
    import ActivityForm from './ActivityForm.vue'
    import AddFab from './AddFab.vue'

    export default {

        components: {
            appNavDrawerLink: NavDrawerLink,
            appActivityForm: ActivityForm,
            appAddFab: AddFab
        },

        data() {
            return {}
        },

        computed: {
            progressPercentage() {
                let data = this.$store.state.memberActivityProgress
                console.log(data)
                return (data.credit / data.required) * 100
            }
        },

        mounted() {
            this.navEvent('close')
        }
    }
</script>

<style>

</style>