<template>
    <div>
        <!--click wrapper as cannot listen for click on a slot-->
        <span @click="openForm">
            <slot name="activator">open form</slot>
        </span>
        <v-dialog v-model="dialog" persistent max-width="500px">

            <v-alert v-model="errorAlert" class="error" icon="warning" transition="scale-transition" dismissible>
                {{ errorMessage }}
            </v-alert>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-card>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs6>
                                    <h4>Activity</h4>
                                </v-flex>

                                <v-flex xs6 class="text-xs-right">
                                    <v-btn class="mr-0" :color="timerColour + ' darken-1'" flat
                                           @click.native="toggleTimer()"
                                    >
                                        {{ timeSeconds | timerDisplay }}
                                        <v-icon>
                                            {{ timerIcon }}
                                        </v-icon>
                                    </v-btn>
                                </v-flex>

                                <v-flex xs12 sm6>
                                    <app-form-date-field
                                            :handleSetDate="setDate"
                                            :dateValue="activity.date"
                                    ></app-form-date-field>
                                </v-flex>

                                <v-flex xs12 sm6>
                                    <v-text-field
                                            label="Quantity (hrs)"
                                            prepend-icon="timer"
                                            v-on:focus="stopTimer"
                                            required
                                            v-bind:rules="quantityRules"
                                            v-model="timeHours"
                                    ></v-text-field>
                                </v-flex>

                                <v-flex xs12>
                                    <v-select
                                            label="Activity Type"
                                            :items="activityTypes"
                                            v-model="activityTypeSelected"
                                            item-text="name"
                                            item-value="id"
                                            return-object
                                            required
                                            v-bind:rules="activityTypeRules"
                                    ></v-select>
                                </v-flex>

                                <v-flex xs12>
                                    <v-text-field
                                            label="Description"
                                            multi-line
                                            rows="3"
                                            v-model="description"
                                            required
                                            v-bind:rules="descriptionRules"
                                    ></v-text-field>
                                </v-flex>
                                <!--<v-flex xs12 sm6>-->
                                <!--<v-select-->
                                <!--label="Rating"-->
                                <!--:items="['Excellent', 'Good', 'Average', 'Poor']"-->
                                <!--&gt;</v-select>-->
                                <!--</v-flex>-->
                                <!--<v-flex xs12 sm6>-->
                                <!--<v-select-->
                                <!--label="Suggest"-->
                                <!--:items="['Keep', 'Review', 'Update', 'Remove']"-->
                                <!--&gt;</v-select>-->
                                <!--</v-flex>-->
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                        <v-btn v-if="valid" color="blue darken-1" dark @click.native="saveActivity">Save</v-btn>
                        <v-btn v-else color="primary" disabled>Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>

        </v-dialog>
    </div>
</template>

<script>
  import {EventBus} from '../../main'
  import moment from 'moment'
  import api from '../../api/mapp'
  import Overlay from '../Overlay.vue'
  import DateField from '../form/DateField.vue'

  export default {
    props: {

      // Option to pass in the list of activity types. This is useful when rendering this component
      // for each item in a list as it is inefficient to make an API call to get the same list, for each item.
      // If this list is NOT passed in then it will be created when the component mounts.
      activityTypes: {
        type: Array
      },

      // Option to pass in an activity object to pre-populate
      activityData: {
        type: Object,
      }
    },

    components: {
      appFormDateField: DateField
    },

    data() {
      return {

        dialog: false,
        errorAlert: false,
        errorMessage: null,

        timeSeconds: 30, // hack to avoid initial validation message
        timerRunning: false,
        intervalId: null,

        // Form elements
        date: null,
        lastComputedHours: 0,
        activityTypeSelected: 0,
        description: "",

        // Validation
        valid: false,
        quantityRules: [
          (v) => !!v && v && v > 0 || "Required, >0"
        ],
        activityTypeRules: [
          (v) => !!v || "Required"
        ],
        descriptionRules: [
          (v) => v && v.length > 2 || "Required"
        ],

      }
    },

    computed: {
      timerColour() {
        if (this.timerRunning) {
          return 'green'
        }
        return 'red'
      },
      timerIcon() {
        if (this.timerRunning) {
          return 'pause'
        }
        return 'play_arrow'
      },

      // this is the 'quantity' value in the input box
      timeHours: {
        // getter
        get() {
          // only compute the value if the timer is running, otherwise the value is computed
          // as the user types into the input box, creating all kinds of weirdness.
          if (this.timerRunning) {
            this.lastComputedHours = (this.timeSeconds / 3600).toFixed(2)
          }
          return this.lastComputedHours
        },

        // setter called when the Quantity input is updated, either by the timer
        // or by user input into the text field
        set(hours) {
          this.timeSeconds = hours * 3600 // sets the timer value
          this.lastComputedHours = hours  // updates timeHours (quantity) - see above
        }
      },

      // computed object that will be passed in the api call
      activity: {

        get() {

          let a = {
            quantity: parseFloat(this.timeHours),
            activityId: this.activityTypeSelected.id,
            description: this.description,
            date: this.date
          }

          // valid flag to activate save button
          if (a.quantity > 0 && a.activityId && a.description.length > 0 && a.date.length > 0) {
            this.valid = true
          } else {
            this.valid = false
          }

          return a
        },

        // this will merge supplied fields?
        set(activity) {
          return activity
        }

      }
    },

    methods: {

      // open the form
      openForm() {
        this.dialog = true
        this.startTimer()
      },

      // setter for the date child component
      setDate(date) {
        this.date = date
      },

      startTimer() {
        this.timerRunning = true
        this.IntervalId = setInterval(() => {
          this.timeSeconds++
        }, 1000)
      },

      stopTimer() {
        this.timerRunning = false
        clearInterval(this.IntervalId)
      },

      toggleTimer() {
        if (this.timerRunning) {
          this.stopTimer()
        } else {
          this.startTimer()
        }
      },

      // Save the activity
      saveActivity() {
        console.log("Saving activity", this.activity)
        api.addActivity(this.activity)
          .then((r) => {
            console.log(r)
            // show a global snackbar alert so user can keep going
            this.dialog = false
            EventBus.$emit('alert', {text: "Activity saved!"})

            // this.alert = true
            // this.alertType = "success"
            // this.alertIcon = "check_circle"
            // this.alertMessage = "Activity saved."
            // this.showForm = false
          }, (r) => {
            console.log(r)
            // show error alert on this page so user can try again
            this.errorAlert = true
            this.errorMessage = r.status + " " + r.statusText + " - " + r.body.message
          })
      }

    },

    filters: {
      timerDisplay(seconds) {

        // by default moment.js will return the string "invalid date" if seconds
        // is not a valid number. As we aren't really inputting date, it is a time
        // catch this first and return our own message. Note this appears on the timer
        // itself in place of 'hh:mm:ss' so it should be short and sweet.
        if (isNaN(seconds) || seconds < 0) {
          return "invalid time"
        }

        return moment.utc(seconds * 1000).format('HH:mm:ss')
      }
    },

    mounted() {

      // Fetch activity types for select list,  if none were passed in
      if (!this.activityTypes || this.activityTypes.length === 0) {
        this.activityTypes = api.getActivityTypes()
      }

      // Initialise local values if an activityData object was passed in
      if (this.activityData) {
        if (this.activityData.description) {
          this.description = this.activityData.description
        }
        if (this.activityData.quantity) {
          this.timeHours = this.activityData.quantity
        }
        if (this.activityData.typeId) {
          // loop through activityTypes (array of objects) to find the matching typeId
          this.activityTypes.forEach((t) => {
            if (t.id == this.activityData.typeId) {
              this.activityTypeSelected = t
            }
          })
        }
        if (this.activityData.date) {
          this.date = this.activityData.date
        }
      }
    }

  }
</script>

<style scoped>
</style>