<template>
    <v-app>
        <v-snackbar
                :top="true"
                :multi-line="true"
                :timeout="alert.timeout"
                :class="alert.class"
                v-model="alert.show"
        >{{ alert.text }}</v-snackbar>
        <app-nav-drawer></app-nav-drawer>
        <main>
            <v-content>
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-content>
        </main>
        <v-footer app></v-footer>
    </v-app>
    <!--<v-app light>-->
        <!--<div id="app">-->
            <!--<app-toolbar></app-toolbar>-->
            <!--<main>-->
                <!--<md-layout md-row>-->
                    <!--<transition name="trans" mode="out-in">-->
                        <!--<router-view></router-view>-->
                    <!--</transition>-->
                <!--</md-layout>-->
            <!--</main>-->
        <!--</div>-->
    <!--</v-app>-->
</template>

<script>
  import { EventBus } from './main'
  import NavDrawer from './components/nav/NavDrawer.vue'

  export default {
    components: {
      //appToolbar: Toolbar,
      appNavDrawer: NavDrawer
    },

    data() {
      return {

        // This is like a 'global' alert that can be triggered by emitting an event
        // Defaults are 'success' because generally any other type of alert will be shown
        // in place. This one allows the user to continue on without delay.
        alert: {
          show: false,
          timeout: 6000,    // default
          class: "success", // default
          text: "Success",
        }
      }
    },

    mounted() {

      // Listen for alert event, a is an 'alert' object
      EventBus.$on('alert', (a) => {
        this.alert = Object.assign(this.alert, a) // merge
        this.alert.show = true
      })
    }

  }
</script>

<style>
    main {
        padding: 20px;
    }
    /* this is for one initial frame only */
    .trans-enter {
        opacity: 0;
    }
    .trans-enter-active {
        transition: opacity 0.2s;
    }
    .trans-leave {
        /* already at opacity 1 */
    }
    .trans-leave-active {
        transition: opacity 0.2s;
        opacity: 0;
    }
</style>
