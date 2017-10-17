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
                <v-card-title>
                    <span class="headline">CPD Activity</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                        label="Description"
                                        multi-line
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
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-btn :color="timerColour + ' darken-1'" flat
                           @click.native="toggleTimer()"
                    >
                        {{ timeSeconds | timerDisplay }}
                        <v-icon>
                            {{ timerIcon }}
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['description', 'url'],

    data () {
      return {
        dialog: false,
        timeSeconds: 0,
        timerRunning: false,
        intervalId: null
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
      }
    },

    filters: {
      timerDisplay(seconds) {
         return moment.utc(seconds*1000).format('HH:mm:ss')
      }
    }
  }
</script>

<style scoped>
    .open {
        text-transform: lowercase;
        margin-left: 0;
    }
</style>