<template>
    <div>
        <app-session></app-session>
        <v-navigation-drawer v-model="drawer" app v-on:toggleDrawer="toggleDrawer">
            <v-toolbar class="deep-orange">
                <!--provides space for top toolbar-->
            </v-toolbar>
            <v-list>

                <app-nav-drawer-link
                        icon="home"
                        :to="{name: 'home'}"
                        exact
                >Home
                </app-nav-drawer-link>

                <!-- activities group -->
                <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
                    <v-list-tile slot="item" @click="">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-for="subItem in item.items"
                                 v-bind:key="subItem.title"
                                 :to="subItem.to"
                                 @click="navEvent('close')"
                                 :exact="subItem.exact"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>{{ subItem.action }}</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>

                <app-nav-drawer-link
                        icon="search"
                        :to="{name: 'resources'}"
                >Resources
                </app-nav-drawer-link>

                <app-nav-drawer-link
                        icon="build"
                        :to="{name: 'tools'}"
                >Tools
                </app-nav-drawer-link>

                <app-nav-drawer-link
                        icon="settings"
                        :to="{name: 'setup'}"
                >Setup
                </app-nav-drawer-link>

                <app-nav-drawer-link
                        icon="help"
                        :to="{name: 'help'}"
                >
                    Help
                </app-nav-drawer-link>

                <app-nav-drawer-link
                        icon="exit_to_app"
                        :to="{name: 'logout', query: {from: currentPath}}"
                >Logout
                </app-nav-drawer-link>

            </v-list>
        </v-navigation-drawer>


        <v-toolbar fixed app :clipped-left="clipped" color="primary" dark>
            <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
            <v-btn icon @click.stop="clipped = !clipped">
                <v-icon>web</v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon class="session-monitor" :color="heartbeat.currentClr" @click="emitOpenSessionDialog">favorite</v-icon>
        </v-toolbar>
    </div>
</template>

<script>
  import Session from '../auth/Session.vue'
  import NavDrawerLink from './NavDrawerLink.vue'
  import {EventBus} from '../../main'

  export default {

    components: {
      appSession: Session,
      appNavDrawerLink: NavDrawerLink
    },

    data() {
      return {
        clipped: true,
        fixed: true,
        drawer: false,
        items: [
          {
            title: 'Activity',
            icon: 'assessment',
            to: {name: 'activitiesIndex'},
            items: [
              {
                title: 'Overview',
                to: {name: 'activitiesIndex'},
                exact: true
              },
              {
                title: 'List',
                to: {name: 'activitiesList'}
              },
              {
                title: 'Add',
                to: {name: 'activitiesAdd'}
              }
            ]
          }
        ],

        // session heartbeat gimmick
        heartbeat: {
          intervalId: 0,
          beating: false,
          deadClr: "red lighten-4",
          sysClr: "red darken-1",
          diaClr: "red darken-3",
          currentClr: "red lighten-4",
        }
      }
    },

    computed: {

      // This sets the title in the toolbar based on the route meta (see routes.js)
      title() {
        return this.$route.meta.title
      },

      // returns the current url for returning from a cancelled action
      currentPath() {
        return this.$route.path
      }

    },

    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      closeDrawer() {
        this.drawer = false
      },
      openDrawer() {
        this.drawer = true
      },

      heartBeatOn() {
        this.heartbeat.intervalId = setInterval(() => {
            this.heartbeat.currentClr = this.heartbeat.sysClr
          setTimeout(()=>{
            this.heartbeat.currentClr = this.heartbeat.diaClr
          }, 300)
        }, 1400)
      },

      heartBeatStop() {
        clearInterval(this.heartbeat.intervalId)
        this.heartbeat.currentClr = this.heartbeat.deadClr
      },

      emitOpenSessionDialog() {
        EventBus.$emit('openSessionDialog')
      }
    },

    mounted() {
      EventBus.$on('navEvent', (opt) => {
        if (opt === 'close') {
          this.closeDrawer()
        }
        if (opt === 'open') {
          this.openDrawer()
        }
        if (opt === 'toggle') {
          this.toggleDrawer()
        }

      })

      // Listen for session heartbeat event.
      // Clear the interval first to avoid fibrillation :)
      EventBus.$on('heartbeat', () => {
        clearInterval(this.heartbeat.intervalId)
        this.heartBeatOn()
      })

      // Listen for heartbeat STOP
      EventBus.$on('heartbeatStop', () => {
        this.heartBeatStop()
      })
    }
  }
</script>


<style scoped>
    .session-monitor:hover {
        cursor: pointer;
    }
</style>