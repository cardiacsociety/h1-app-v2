<template>
    <div>
        <app-overlay v-if="overlay"></app-overlay>

        <form novalidate @submit.stop.prevent="submit">

            <md-input-container>
                <label>Activity Date [datepicker]</label>
                <md-input v-model="activity.date"></md-input>
            </md-input-container>

            <div class="field-group">
                <md-input-container>
                    <label for="type">Activity Type</label>
                    <md-select
                            name="activityType"
                            id="type"
                            v-model="activity.typeId"
                            v-on:change="updateQuantityUnit(activity.typeId)"
                    >
                        <md-option
                                v-for="type in activityTypes"
                                v-bind:value="type.id"
                                key="type.id"
                        >{{ type.name }}
                        </md-option>
                    </md-select>
                </md-input-container>
            </div>

            <md-input-container>
                <label>Activity Description</label>
                <md-textarea v-model="activity.description"></md-textarea>
            </md-input-container>

            <md-input-container>
                <label>Quantity ({{ quantityUnit }})</label>
                <md-input type="number"></md-input>
            </md-input-container>

        </form>

        <div>
            <p>activity object</p>
            <p>{{ activity }}</p>
        </div>

    </div>
</template>

<script>
  import Overlay from '../Overlay.vue'

  export default {

    components: {
      appOverlay: Overlay
    },

    data() {
      return {
        overlay: false,
        activityTypes: [],
        activity: {
          date: '',
          typeId: 0,
          description: '',
          unit: '',
        },
        quantityUnit: '',
      }
    },

    mounted() {
      this.fetchActivityTypes()
    },

    methods: {
      fetchActivityTypes() {
        this.overlay = true
        this.$http.get('g/activities')
          .then(r => {
            r.body.data.forEach(e => {
              this.activityTypes.push({
                id: e.id,
                name: e.name,
                unit: e.credit.unitName
              })
            })
            console.log(r)
            //this.store()
            this.overlay = false
          }, r => {
            console.log(r)
            this.overlay = false
            // middleware will force login
          })
      },

      // Display the correct unit by finding the activity type id in the array of activityTypes
      updateQuantityUnit(activityTypeId) {
        this.activityTypes.forEach((elem) => {
          if (elem.id === activityTypeId) {
            this.quantityUnit = elem.unit
          }
        })
      }
    }
  }
</script>

<style>

</style>