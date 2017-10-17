<template>
    <div>
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
                        :to="{name: 'logout'}"
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
            <v-icon color="red">favorite</v-icon>
        </v-toolbar>
    </div>
</template>

<script>
  import NavDrawerLink from './NavDrawerLink.vue'
  import {EventBus} from '../../main'

  export default {
    components: {
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
        ]
      }
    },

    computed: {

      // This sets the title in the toolbar based on the route meta (see routes.js)
      title() {
        return this.$route.meta.title
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
    }
  }
</script>


<style>

</style>