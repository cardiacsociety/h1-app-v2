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
                                <v-flex xs8>
                                    <h4>
                                        Activity
                                        <span v-if="activity.id">
                                            <v-chip color="orange darken-2"
                                                    text-color="white">edit ID: {{ activity.id }}</v-chip>
                                        </span>
                                        <span v-else>
                                            <v-chip color="green" text-color="white">new</v-chip>
                                        </span>
                                    </h4>
                                </v-flex>
                                <v-flex xs4 class="text-xs-right">
                                    <v-btn class="mr-0" :color="timerColour + ' darken-1'" flat
                                           @click.native="toggleTimer()"
                                    >
                                        {{ timerSeconds | timerDisplay }}
                                        <v-icon>
                                            {{ timerIcon }}
                                        </v-icon>
                                    </v-btn>
                                </v-flex>

                                <v-flex xs12 sm6>
                                    <app-form-date-field
                                            :handleSetDate="setDate"
                                            :initialDateValue="date"
                                    ></app-form-date-field>
                                </v-flex>

                                <v-flex xs12 sm6>
                                    <v-text-field
                                            label="Quantity (hrs)"
                                            prepend-icon="timer"
                                            v-on:focus="stopTimer"
                                            v-model="quantity"
                                            required
                                            v-bind:rules="quantityRules"
                                    ></v-text-field>
                                </v-flex>

                                <v-flex xs12>
                                    <v-select
                                            label="Activity Type"
                                            :items="activityTypes"
                                            v-model="activity.activityId"
                                            item-text="name"
                                            item-value="id"
                                            required
                                            v-bind:rules="activityTypeRules"
                                    ></v-select>
                                </v-flex>

                                <v-flex xs12>
                                    <v-text-field
                                            label="Description"
                                            multi-line
                                            rows="3"
                                            v-model="activity.description"
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
      activityTypesData: {
        type: Array
      },

      // Option to pass in an activity object to pre-populate
      activityData: {
        type: Object,
      },

      // Force a fresh form
      reset: {
        type: Boolean,
        default: false
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

        timerSeconds: 30, // hack to avoid initial validation message
        timerRunning: false,
        intervalId: null,

        // Form data elements
        activity: {
          id: null,
          activityId: null, // activity TYPE id
          date: null,
          quantity: 0,
          description: "",
        },

        // array of activity type objects
        activityTypes: [],
        activityTypeSelected: {},

        lastQuantity: 0,

        // Validation
        //valid: false,
        quantityRules: [
          (v) => !!v && v && v > 0 || "Required > 0"
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

      date() {
        if (this.activityData && this.activityData.date) {
          return this.activityData.date
        }
        if (this.activity && this.activity.date) {
          return this.activity.date
        }
        return ""
      },


      // computed 'quantity' value for the text input. Only calculated when the timer is running to
      // avoid interference with manual user input.
      quantity: {
        get() {
          if (this.timerRunning) {
            this.lastQuantity = (this.timerSeconds / 3600).toFixed(2)
          }
          return this.lastQuantity
        },
        // setter called when input is updated, by timer or user input
        set(hours) {
          this.timerSeconds = hours * 3600 // sets the timer value
          this.lastQuantity = hours  // updates quantity (quantity) - see above
        }
      },

      valid: {
        set() {
          return false
        },
        get() {
          if (this.activity.quantity
            && this.activity.activityId
            && this.activity.date
            && this.activity.description) {
            return true
          }
          return false
        }
      },

    },

    watch: {
      // sync the computed quantity with activity.quantity
      quantity() {
        this.activity.quantity = parseFloat(this.quantity)
      }
    },

    methods: {

      // open the form
      openForm() {
        this.dialog = true
        if (this.reset) {
          this.resetForm()
        }
      },

      // setter for the date child component
      setDate(date) {
        this.activity.date = date
      },

      startTimer() {
        this.timerRunning = true
        this.IntervalId = setInterval(() => {
          this.timerSeconds++
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

      // Save the activity, if we have an id we are updating, if not, adding
      saveActivity() {

        if (this.activity.id) {
          console.log("Update activity")
          api.updateActivity(this.activity)
            .then((r) => {
              console.log(r)
              this.dialog = false // close form
              EventBus.$emit('alert', {text: "Activity updated!"}) // global 'snackbar' alert
              EventBus.$emit('updatedActivity') // trigger a forceUpdate() in parent so changes are visible
            }, (r) => {
              console.log(r)
              this.errorAlert = true // this page error alert
              this.errorMessage = r.status + " " + r.statusText + " - " + r.body.message
            })

        } else {
          console.log("Add activity")
          api.addActivity(this.activity)
            .then((r) => {
              console.log(r)
              this.dialog = false // close form
              EventBus.$emit('alert', {text: "Activity saved!"}) // global 'snackbar' alert
              EventBus.$emit('addedActivity', this.activity) // update parent view
            }, (r) => {
              console.log(r)
              this.errorAlert = true // this page error alert
              this.errorMessage = r.status + " " + r.statusText + " - " + r.body.message
            })
        }
      },

      // clear form values - note, also clears the date
      resetForm() {
        this.$refs.form.reset()
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

      this.$nextTick(() => {

        // Fetch activity types for select list, if none were passed in
        if (this.activityTypesData && this.activityTypesData.length > 0) {
          this.activityTypes = this.activityTypesData
        } else {
          api.getActivityTypes()
            .then(r => {
              r.body.data.forEach(e => {
                this.activityTypes.push({
                  id: e.id,
                  name: e.name,
                  unit: e.credit.unitName
                })
              })

              // id of activity TYPE
              // this is here because can't be set this until we have the list
              if (this.activityData.activityId) {
                console.log("pre-select activity type id", this.activityData.activityId)
                this.activityTypes.forEach((t) => {
                  if (t.id === this.activityData.activityId) {
                    this.activity.activityId = t.id
                  }
                })
              }

            }, r => {
              console.log("Error fetching activity types", r)
            })
        }

        // activityData object can be used to initialise the local activity object
        if (this.activityData) {

          // id of member activity record (editing an existing record)
          if (this.activityData.id) {
            this.activity.id = this.activityData.id
          }

          // quantity (generally hours)
          if (this.activityData.quantity) {
            // initialise the computed value, watcher will set activity.quantity
            this.quantity = this.activityData.quantity
          }

          // id of activity TYPE
          if (this.activityData.activityId) {
            console.log("pre-select activity type id", this.activityData.activityId)
            this.activityTypes.forEach((t) => {
              if (t.id === this.activityData.activityId) {
                this.activity.activityId = t.id
              }
            })
          }

          // Description / details
          if (this.activityData.description) {
            this.activity.description = this.activityData.description
          }
        }

        // Start the timer if it is a new record
        if (!this.activityData || !this.activityData.id) {
          this.startTimer()
        }
      })

    },
  }
</script>

<style scoped>
</style>