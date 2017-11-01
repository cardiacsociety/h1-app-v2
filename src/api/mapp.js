import Config from '../config/config'
import Vue from 'vue'

import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.root = Config.API_BASE_URL

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

let jwt = Vue.localStorage.get('appToken')

// interceptors (middleware)
Vue.http.interceptors.push((request, next) => {
  // Add JWT to all requests, if not required, eg for auth, then an empty string will be ok
  request.headers.set('Authorization', 'Bearer ' + jwt)
  next()
})


export default {

  // auth POSTs login to api, returns a promise
  auth(login, password) {
    const auth = {login, password} // post body
    return Vue.http.post('auth/member', auth)
  },

  // refreshToken GETs a new token, returns a promise
  refreshToken() {
    return Vue.http.get('m/token')
  },

  getActivityTypes() {

    let activityTypes = []

    Vue.http.get('g/activities')
      .then(r => {
        r.body.data.forEach(e => {
          activityTypes.push({
            id: e.id,
            name: e.name,
            unit: e.credit.unitName
          })
        })
        console.log("API called to fetch activity types")
      }, r => {
        console.log(r)
      })

    return activityTypes
  }
}


// This will check the users local storage for a reasonably up-to-date version of this list
// If found it will use that, otherwise, it will fetch a fresh list from the API
// todo - make it work!
// export const activityTypes = [
//   {id: 1, name: "Activity One", description: "Description of activity one"},
//   {id: 2, name: "Activity Two", description: "Description of activity two"},
// ]

// api stuff for later (from a Vue component)
// fetchActivityTypes() {
//   this.overlay = true
//   this.$http.get('g/activities')
//     .then(r => {
//       r.body.data.forEach(e => {
//         this.activityTypes.push({
//           id: e.id,
//           name: e.name,
//           unit: e.credit.unitName
//         })
//       })
//       console.log(r)
//       //this.store()
//       this.overlay = false
//     }, r => {
//       console.log(r)
//       this.overlay = false
//     })
// }


