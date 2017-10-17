<template>
    <v-app>
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
  //import Toolbar from './components/nav/Toolbar.vue'
  import NavDrawer from './components/nav/NavDrawer.vue'


  export default {
    components: {
      //appToolbar: Toolbar,
      appNavDrawer: NavDrawer
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
