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

  // Auth return a promise for the token
  auth(login, password) {

    const auth = {login, password} // post body

    // return the promise, which returns the token :)
    return Vue.http.post('auth/member', auth)
      .then(r => {
        return r.body.data.token
      }, () => {
        return null
      })
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
        console.log(r)
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


