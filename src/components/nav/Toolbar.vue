<template>
    <div>
        <md-toolbar>
            <md-button class="md-icon-button" @click="toggleNav">
                <md-icon>menu</md-icon>
            </md-button>

            <h2 class="md-title" style="flex: 1"><span style="color: red">Heart</span>One</h2>

            <md-button class="md-icon-button">
                <md-icon>favorite</md-icon>
            </md-button>
        </md-toolbar>

        <md-sidenav class="md-left" ref="sideNav">
            <md-toolbar class="md-large">
                <div class="md-toolbar-container">
                    <h3 class="md-title">Sidenav</h3>
                </div>
            </md-toolbar>

            <md-list>
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'home'}" exact>
                        <md-icon>home</md-icon>
                        <span>Home</span>
                    </router-link>
                </md-list-item>
                <md-list-item md-expand-multiple>
                    <md-icon>assessment</md-icon>
                    <span>Activities</span>
                    <md-list-expand>
                        <md-list>
                            <md-list-item class="md-inset" @click.native="closeNav">
                                <router-link :to="{name: 'activitiesHome'}" exact>Overview</router-link>
                            </md-list-item>
                            <md-list-item class="md-inset" @click.native="closeNav">
                                <router-link :to="{name: 'activitiesList'}" exact><span>List</span></router-link>
                            </md-list-item>
                            <md-list-item class="md-inset" @click.native="closeNav">
                                <router-link :to="{name: 'activitiesAdd'}" exact>Add</router-link>
                            </md-list-item>
                        </md-list>
                    </md-list-expand>
                </md-list-item>
            </md-list>

            <ul class="md-list md-theme-default">
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'resources'}" exact>
                        <md-icon>search</md-icon>
                        <span>Resources</span></router-link>
                </md-list-item>
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'tools'}" exact>
                        <md-icon>build</md-icon>
                        <span>Tools</span></router-link>
                </md-list-item>
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'setup'}" exact>
                        <md-icon>settings</md-icon>
                        <span>Setup</span></router-link>
                </md-list-item>
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'help'}" exact>
                        <md-icon>help</md-icon>
                        <span>Help</span></router-link>
                </md-list-item>
                <md-list-item @click.native="closeNav">
                    <router-link :to="{name: 'logout'}" exact>
                        <md-icon>exit_to_app</md-icon>
                        <span>Logout</span></router-link>
                </md-list-item>
            </ul>
        </md-sidenav>

    </div>
</template>

<script>
  export default {
    methods: {
      toggleNav() {
        this.$refs.sideNav.toggle()
      },
      closeNav() {
        this.$refs.sideNav.close()
      }
    }
  }
</script>

<style>
</style>
