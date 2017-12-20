import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import activities from '../data/activities'


Vue.use(Vuex)
export const store = new Vuex.Store({
    state: {
        activityTypes: activities.getActivityTypes(),
        memberActivities: activities.getMemberActivities(),
    },
    mutations: {
        setMemberActivity(state, activity) {

            console.log("Set member activity...")

            // map fields returned from the api
            const updatedActivity = {}
            updatedActivity.id = activity.id
            updatedActivity.activityName = activity.type
            updatedActivity.typeId = activity.typeId
            updatedActivity.date = activity.date
            updatedActivity.quantity = activity.credit
            updatedActivity.description = activity.description


            // replace the activity in the store (if there) with the updated one
            console.log("Looking to replace an existing activity (update)...")
            for (let i = 0; i < state.memberActivities.length; i++) {
                if (state.memberActivities[i].id === updatedActivity.id) {
                    console.log("Found... updating id " + updatedActivity.id)
                    // does not 'react' if assign the entire object at position i
                    state.memberActivities[i].activityName = updatedActivity.activityName
                    state.memberActivities[i].typeId = updatedActivity.typeId
                    state.memberActivities[i].date = updatedActivity.date
                    state.memberActivities[i].quantity = updatedActivity.quantity
                    state.memberActivities[i].description = updatedActivity.description
                    return
                }
            }

            // If we are here, there was no match so it was a newly added record.
            // In this case splice the new activity into the list at the first position
            // on the correct date
            //state.memberActivities.unshift(updatedActivity)
            console.log("None found, looking for a place for the new activity based on date...")
            for (let i = 0; i < state.memberActivities.length; i++) {
                if (moment(updatedActivity.date).isSameOrAfter(state.memberActivities[i].date)) {
                    console.log('Found a date position, insert activity at index ' + i )
                    state.memberActivities.splice(i, 0, updatedActivity)
                    return
                }
            }

            // otherwise, add to the end
            console.log("None found, adding the activity to the end of the list.")
            state.memberActivities.push(updatedActivity)
        }
    }
})



