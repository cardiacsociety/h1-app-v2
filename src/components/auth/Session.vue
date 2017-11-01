<template>
    <v-dialog v-model="sessionDialog">
        <v-card>
            <v-card-title>
                <span><h5>Session</h5></span>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <div v-if="session">
                    <p>Token: ...{{ token | trimToken }}</p>
                    <p>TTL: {{ ttl | roundMinutes }} minutes</p>
                    <p>Refresh in: {{ (ttl - refreshTTL) | roundMinutes }} min</p>
                </div>
                <div v-else>
                    <p>No session</p>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn v-if="session" @click.stop="refreshToken">force refresh</v-btn>
                <v-btn v-if="!session" @click.stop="login">login</v-btn>
                <v-btn color="primary" flat @click.stop="sessionDialog=false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import jwtDecode from 'jwt-decode'
  import {EventBus} from '../../main'
  import api from '../../api/mapp'

  export default {

    data() {
      return {

        // token data
        // The token stored in local storage
        token: null,
        // the decoded token, for convenience
        decoded: {},
        // the time to live in minutes
        ttl: null,

        // refresh token when TTL drops to this number
        refreshTTL: 60,

        // refreshCheckInterval in minutes
        refreshCheckInterval: 0.1,

        // just used to signal a state change for this component
        // and force computed value update
        refresh: false,

        // testing
        sessionDialog: false
      }
    },

    computed: {
      // A boolean to signify if there is a valid session (token)
      // For this to be true we need a valid token with exp > now,
      // ie, ttl > 0 will do the job
      session() {
        if (this.ttl > 0) {
          EventBus.$emit('heartbeat')
          return true
        }

        EventBus.$emit('heartbeatStop')
        return false
      }
    },

    methods: {

      // set token data
      setTokenData() {

        // Make sure we have the token in local storage
        this.token = this.$localStorage.get("appToken")
        if (this.tokenValid()) {
          this.decoded = jwtDecode(this.token)
          this.ttl = this.calcTTL()
        } else {
          this.token = null
          this.decoded = {}
          this.ttl = null
        }
      },

      // checks that a token looks ok, does not validate expiry or anything else
      tokenValid() {
        try {
          this.decoded = jwtDecode(this.token)
          if (this.decoded) {
            return true
          }
          return false
        }
        catch (e) {
          return false
        }
      },

      // calculate the time to live in minutes
      calcTTL() {
        const now = Date.now()
        const expiry = this.decoded.exp * 1000 // convert to milliseconds
        let ttl = (expiry - now) / 1000 / 60  // back to minutes
        return ttl
      },

      refreshToken() {
        api.refreshToken()
          .then((r) => {
            this.$localStorage.set("appToken", r.body.token)
            this.setTokenData()
          }, (r) => {
            console.log("Could not refresh token... leaving current token in local storage")
            console.log(r)
          })
      },

      // go to login page
      login() {
        this.sessionDialog = false
        this.$router.push('/login')
      },

    },

    filters: {
      trimToken(s) {
        if (s) {
          return s.substring(s.length - 20)
        }
      },
      roundMinutes(m) {
        if (m) {
          return m.toFixed(2)
        }
      }
    },

    mounted() {
      // this ensures that the code will only run after all
      // components have been rendered
      this.$nextTick(() => {

        // Set the token data initially, ie a page refresh, and then set up periodic checks
        this.setTokenData()
        setInterval(() => {

          // reset token data on each interval
          this.setTokenData()

          // need a current token for Auth header, to refresh
          if (this.token) {
            if (this.ttl < this.refreshTTL) {
              console.log("Time to refresh!")
              this.refreshToken()
            }
          }
        }, (this.refreshCheckInterval * 60 * 1000))


        // Listen for relevant events

        // successful login
        EventBus.$on('login', () => {
          this.refresh = true
        })

        // open the session dialog
        EventBus.$on('openSessionDialog', () => {
          this.sessionDialog = true
        })

      })
    }
  }
</script>

<style>
</style>