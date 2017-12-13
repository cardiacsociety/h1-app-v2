import graphql from '../api/graphql'

export default {

    getActivityTypes() {

        console.log("getActivityTypes()")

        let activityTypes = []
        graphql.getActivityTypes()
            .then(data => {
                let activities = data.activities
                activities.forEach(v => {
                    activityTypes.push({
                        id: v.id,
                        name: v.name,
                        //unit: v.credit.unitName
                    })
                })
            })
            .catch((r) => {
                console.log("Could not fetch activity types, response:")
                console.log(r)
            })

        return activityTypes
    },

    getMemberActivities() {

        let memberActivities = []
        graphql.getMemberActivities()
            .then(data => {
                console.log(typeof data.memberUser.activities)
                let activities = Array.from(data.memberUser.activities)
                console.log(typeof activities)
                console.log(data)
                activities.forEach((v) => {
                    memberActivities.push({
                        id: v.id,
                        date: v.date,
                        description: v.description,
                        quantity: v.credit,
                        typeId: v.typeId,
                        activityName: v.type,
                        categoryName: v.category,
                    })
                })

            }, r => {
                console.log("Error getting member activities for Vuex store:")
                console.log(r)
            })

        console.log(Array.from(memberActivities)[0])
        return memberActivities
    }
}


