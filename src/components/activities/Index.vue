<template>
    <div>
        <app-activity-form>
            <app-add-fab slot="activator"></app-add-fab>
        </app-activity-form>
        <h3>Activities Overview</h3>
        <div>
            <div>CPD Progress</div>
            <v-progress-circular
                    v-bind:size="120"
                    v-bind:width="15"
                    v-bind:rotate="360"
                    v-bind:value="progress"
                    color="deep-orange"
            >
                {{ progress }}%
            </v-progress-circular>
        </div>
        <div>
            <v-list>
                <app-activity-form>
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
        return {
            progress: 55
        }
      },

      mounted() {
        this.navEvent('close')
      }
    }
</script>

<style>

</style>