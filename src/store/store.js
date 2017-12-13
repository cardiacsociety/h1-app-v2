import Vue from 'vue'
import Vuex from 'vuex'
import activities from '../data/activities'

Vue.use(Vuex)
export const store = new Vuex.Store({
    state: {
        activityTypes: activities.getActivityTypes(),
        memberActivities: activities.getMemberActivities(),
    },
    mutations: {
        setMemberActivity(state, obj) {
            // todo should put the item in the correct date order?
            state.memberActivities.unshift(obj)
        }
    }
})



