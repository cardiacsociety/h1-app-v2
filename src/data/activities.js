import graphql from '../api/graphql'

export default {

    getActivityTypes() {

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
                let activities = data.memberUser.activities
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
                // todo - here is where we can signal busy... use event emitter globally to create the overlay
                console.log('done')

            }, r => {
                console.log("Error getting member activities from graphql server:")
                console.log(r)
            })

        console.log(Array.from(memberActivities)[0])
        return memberActivities
    },

    setMemberActivity(activity) {
        return graphql.setMemberActivity(activity)
    },

    // get some data about the member's progress against CPD requirements
    getMemberActivityProgress() {

        let progress = {
            credit: 0,
            required: 0,
        }

        graphql.getMemberActivityProgress()
            .then((data) => {
                progress.credit = data.memberUser.evaluation.creditObtained
                progress.required = data.memberUser.evaluation.creditRequired
            })
            .catch((r)=>{
                console.log("Error fetching member activity progress")
                console.log(r)
            })

       return progress
    }

}


