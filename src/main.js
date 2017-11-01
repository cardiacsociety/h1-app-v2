import Config from './config/config'
console.log("Config -------")
console.log(Config)
console.log('--------------')

import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import VueLocalStorage from 'vue-localstorage'
import jwtDecode from 'jwt-decode'
import {routes} from './routes'
import InstantSearch from 'vue-instantsearch'

import App from './App.vue'

// Material Style...
Vue.use(Vuetify)

// Local storage for token
Vue.use(VueLocalStorage)
//const appToken = Vue.localStorage.get('appToken', 'pretentdtoken') // second arg is fallback value
//console.log(appToken)

// Algolia
Vue.use(InstantSearch)

// API stuff...
Vue.use(VueResource);
Vue.http.options.root = Config.API_BASE_URL

// interceptors (middleware)
Vue.http.interceptors.push((request, next) => {

  // Add JWT to all requests, if not required, eg for auth, then an empty string will be ok
  console.log('Add token from local storage to every request...')
  request.headers.set('Authorization', 'Bearer ' + Vue.localStorage.get('appToken'))

  // code to deal with request here... but just want to get the fresh token, if it exists!
  // access the response in the next() function
  // check if the route requires auth...
  console.log(request)

  next(response => {

    // if (response.body.status === 400) {
    //   alert('Bad auth request')
    //   this.$router.push({name: 'activitiesAdd'})
    // }

    // if (response.body.status === 401) {
    //   alert('Unauthorized')
    //   this.$router.push({name: 'activitiesAdd'})
    // }

    // if (response.body.token) {
    //   console.log('Fresh token in response... updating appToken in local storage')
    //   Vue.localStorage.set('appToken', response.body.token)
    // }
  })
})

// Router
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  // default is 'hash', history has no '#' but requires web server
  // need history mode to do scrollBehaviour
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {selector: to.hash}
    }
    return {x: 0, y: 0}
  }
})

// router guards (middleware) - gets executes on EVERY route
// Can use for arbitrary checks like auth / permissions
// this can also be set on individual routes using beforeEnter(), or in
// the individual component using instance method beforeRouteEnter() method
//router.beforeEach((to, from, next) => {
//console.log('global .beforeEach()')
// next must be called
//next() // continue with to route
// //next(false) // abort and stay on page
// //next('/somewhere') // go to a path
// //next({path Obj}) // a router-link object
//})


// Global EventBus
export const EventBus = new Vue()

// This is a global mixin, it is applied to every vue instance
Vue.mixin({

  data() {
    return {
      appUserName: 'test'
    }
  },

  computed: {
    appToken() {
      return Vue.localStorage.get('appToken')
    }
  },

  methods: {

    // checkAuth and 'redirect' (route name)
    checkAuth(redirect) {
      console.log('Global mixin ... checkAuth() - checking token:')

      // route object if auth is required
      let authRoute = {name: 'login', query: {to: redirect}}

      if (!this.appToken) {
        console.log('Will redirect to route name: ' + redirect)
        this.$router.push(authRoute)
        return
      }

      // check expiry
      console.log('Check JWT...')
      console.log(this.appToken)

      // Auth if token is bung
      let decoded = {}
      try {
        decoded = jwtDecode(this.appToken)
        console.log('Token decoded: ')
        console.log(decoded);
      }
      catch (e) {
        console.log('Bung token')
        console.log(e)
        this.$router.push(authRoute)
        return
      }

      // Auth if token has expired
      const now = Date.now()
      const expiry = decoded.exp * 1000
      if (expiry <= now) {
        console.log('Expired token')
        this.$router.push(authRoute)
        return
      }

      console.log('Token valid until ' + new Date(expiry))
    },

    // Used to enable 'open', 'close' and 'toggle' from any button or link
    navEvent(opt) {
      if ( opt != 'close' && opt != 'open' && opt != 'toggle') {
        console.log("navEvent option must be one of: 'close', 'open', 'toggle' ")
      }
      EventBus.$emit('navEvent', opt)
    }
  }
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
