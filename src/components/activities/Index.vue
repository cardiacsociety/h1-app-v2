<template>
    <div>
        {{ checkAuth('activitiesIndex') }}
        <app-add-fab></app-add-fab>
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
                <app-nav-drawer-link
                        icon="library_add"
                        @click="closeDrawer()"
                        :to="{name: 'activitiesAdd'}"
                >Add a new activity
                </app-nav-drawer-link>
                <app-nav-drawer-link
                        icon="history"
                        @click="closeDrawer()"
                        :to="{name: 'activitiesList'}"
                >View a list of past activities
                </app-nav-drawer-link>
            </v-list>
        </div>
    </div>
</template>

<script>
    import NavDrawerLink from '../nav/NavDrawerLink.vue'
    import AddFab from './AddFab.vue'

    export default {

      components: {
        appNavDrawerLink: NavDrawerLink,
        appAddFab: AddFab
      },

      data() {
        return {
            progress: 55
        }
      },
    }
</script>

<style>

</style>