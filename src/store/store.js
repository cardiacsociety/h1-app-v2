import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import activities from '../data/activities'


Vue.use(Vuex)
export const store = new Vuex.Store({
    state: {
        activityTypes: activities.getActivityTypes(),
        memberActivities: activities.getMemberActivities(),
        memberActivityProgress: activities.getMemberActivityProgress(),
    },
    mutations: {
        setMemberActivity(state, activity) {

            // todo - how to show bust overlay from async call
            console.log("Rebuilding activity list in store...")
            state.memberActivities = activities.getMemberActivities()
            state.memberActivityProgress= activities.getMemberActivityProgress()
            return

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
            let existingRecord = false
            for (let i = 0; i < state.memberActivities.length; i++) {
                if (state.memberActivities[i].id === updatedActivity.id) {
                    existingRecord = true
                    console.log("Found... updating id " + updatedActivity.id)
                    // does not 'react' if assign the entire object at position i
                    state.memberActivities[i].activityName = updatedActivity.activityName
                    state.memberActivities[i].typeId = updatedActivity.typeId
                    state.memberActivities[i].date = updatedActivity.date
                    state.memberActivities[i].quantity = updatedActivity.quantity
                    state.memberActivities[i].description = updatedActivity.description
                }
            }

            // If we are here, there was no match so it was a newly added record.
            // In this case splice the new activity into the list at the first position
            // on the correct date
            //state.memberActivities.unshift(updatedActivity)
            let replace = 0
            if (existingRecord) {
                console.log("Moving existing record to correct date position...")
                replace = 1
            } else {
                console.log("Inserting new record at correct date position...")
            }

            for (let i = 0; i < state.memberActivities.length; i++) {
                if (moment(updatedActivity.date).isSameOrAfter(state.memberActivities[i].date)) {
                    console.log('Found date position - index ' + i + ", replace = " + replace)
                    state.memberActivities.splice(i, replace, updatedActivity)
                    return
                }
            }

            // otherwise, add to the end
            console.log("None found, adding the activity to the end of the list.")
            state.memberActivities.push(updatedActivity)
        }
    }
})



