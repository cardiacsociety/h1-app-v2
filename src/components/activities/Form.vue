<template>
    <v-dialog v-model="dialog" persistent max-width="500px">
        <v-btn
                class="open"
                color="blue darken-1" flat
                slot="activator"
                @click.native="openResource(url)">
            {{ url }}
        </v-btn>
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
                            <app-form-date-field v-model="activity.date"></app-form-date-field>
                        </v-flex>

                        <v-flex xs12 sm6>
                            <v-text-field
                                    label="Quantity (hrs)"
                                    required
                                    prepend-icon="timer"
                                    v-on:focus="waitForUserInput"
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
                            ></v-select>
                        </v-flex>

                        <v-flex xs12>
                            <v-text-field
                                    label="Description"
                                    multi-line
                                    rows="3"
                                    required
                                    :value="description"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-select
                                    label="Rating"
                                    :items="['Excellent', 'Good', 'Average', 'Poor']"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-select
                                    label="Suggest"
                                    :items="['Keep', 'Review', 'Update', 'Remove']"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" dark @click.native="saveActivity">Save</v-btn>
            </v-card-actions>
            {{ activity }}
        </v-card>
    </v-dialog>
</template>

<script>
  import moment from 'moment'
  import Overlay from '../Overlay.vue'
  import DateField from '../form/DateField.vue'
  import api from '../../api/mapp'

  export default {
    props: {
      activityTypes: {
        type: Array,
        required: true
      },
      description: {
        type: String
      },
      url: {
        type: String,
        required: true
      }
    },

    components: {
      appFormDateField: DateField
    },

    data() {
      return {
        dialog: false,
        timeSeconds: 0,
        timerRunning: false,
        intervalId: null,
        computeHours: true,
        lastComputedHours: null,

        activityTypeSelected: null,
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

      timeHours: {
        // getter
        get() {
          // only compute the value if the timer is running
          if (this.computeHours) {
            return (this.timeSeconds / 3600).toFixed(2)
          }
          return this.lastComputedHours
        },
        // setter
        set(hours) {
          this.timeSeconds = hours * 3600
        }
      },

      // computed object that will be passed in the api call
      activity() {
        return {
          quantity: this.timeHours,
        }
      }
    },

    methods: {

      openResource(url) {
        window.open(url)
        this.startTimer()
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

      // This function stops the timer, and prevents
      // the computed 'timeHours' from updating
      waitForUserInput() {
        this.stopTimer()
        this.lastComputedHours = this.timeHours
        this.computeHours = false
      },

      // Save the activity
      saveActivity() {
        // set the quantity, the other activity fields are set directly from the form
        this.activity.typeId = this.activityTypeSelected.typeId
        this.activity.description = ""
        this.activity.quantity = this.timeHours
        this.activity.date = ""
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
      this.activityTypeSelected = this.activityTypes[1]
    }

  }
</script>

<style scoped>
    .open {
        text-transform: lowercase;
        margin-left: 0;
    }
</style>