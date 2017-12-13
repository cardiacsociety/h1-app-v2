import Config from '../config'
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import { request, GraphQLClient } from 'graphql-request'

Vue.use(VueLocalStorage)

// Get the token
const token = Vue.localStorage.get('appToken')
const url = Config.GRAPHQL_API_BASE_URL


export default {


    // fetch activity types
    getActivityTypes() {

        let query = `query {
                        activities {
                            id
                            code
                            name
                        }
                    }`
        return request(url, query)
    },


    // fetch activities for the user
    getMemberActivities() {

        let query = `query MemberUser($token: String!){
                        memberUser(token: $token) 
                        {
                            id
                            firstName
                            lastName
                            activities {
                              id
                              typeId
                              type
                              category
                              date
                              description
                              credit
                            }
                        }
                    }`


        let variables = {
            token: token
        }


        return request(url, query, variables)
    },

    // add or update a member activity - will update if the activity id is present in the memberActivity object
    // that is passed in.
    setMemberActivity(memberActivity) {

        // tweak a few field names... in fact only the quantity field needs to be changed to 'credit'
        const activityObject = {
            id : memberActivity.id,
            typeId: memberActivity.typeId,
            date: memberActivity.date,
            credit: memberActivity.quantity,
            description: memberActivity.description,
        }

        let mutation = `mutation MemberUser($token: String!, $memberActivityInput: memberActivityInput!) {
                        memberUser(token: $token) 
                        {
                            id
                            setActivity(obj: $memberActivityInput){
                              id
                              typeId
                              type
                              category
                              date
                              description
                              credit
                            }
                        }
                    }`


        let variables = {
            token: token,
            memberActivityInput: activityObject,
        }



        return request(url, mutation, variables)
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






