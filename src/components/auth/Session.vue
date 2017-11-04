<template>
    <v-dialog v-model="sessionDialog">
        <v-card>
            <v-card-title>
                <span><h5>Session Monitor</h5></span>
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
                <v-btn v-if="session" @click="refreshToken">refresh</v-btn>
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
        lsTokenKey: 'appToken', // local storage token key name
        token: null,    // token
        decoded: {},    // convenience
        ttl: null,      // minutes
        //valid: false,   // valid and future exp

        refreshTTL: 60, // refresh when TTL = x mins
        refreshCheckInterval: 1, // validate token every x mins

        // set / unset periodic check interval
        checkIntervalId: 0,

        // testing
        sessionDialog: false
      }
    },

    computed: {
      // A boolean to signify if there is a valid session (token)
      // For this to be true we need a valid token with exp > now,
      // ie, ttl > 0 will do the job
      session() {
        if (this.token) {
          EventBus.$emit('heartbeat')
          return true
        }

        EventBus.$emit('heartbeatStop')
        return false
      }
    },

    methods: {

      // validate the token, and set token data values.
      // t - a token to validate
      // ls - local storage key name for the token to validate
      // If both args are supplied validateToken will check that the token in local storage
      // matches t.
      validateToken(t, ls) {

        if (!t && !ls) {
          console.log("validateToken() - no args supplied, need a token and / or a local storage key name")
          return false
        }

        if (ls) {
          this.token = this.$localStorage.get("appToken")
          // matches t?
          if (t) {
            if (this.token != t) {
              console.log("validateToken() - supplied token argument does not match the token in local storage")
              return false
            }
          }
        }

        if (t) {
          this.token = t
        }

        // decode the token
        try {
          this.decoded = jwtDecode(this.token)
          console.log("validateToken() - decoded", this.decoded)
        }
        catch(e) {
          console.log("validateToken() - could not decode", e)
          return false
        }

        this.ttl = this.calcTTL()
        if (this.ttl > 0) {
          console.log("validateToken() - ttl", this.ttl + " minutes")
          return true
        }

        // expired
        console.log("validateToken() - token has expired")
        return false
      },

      // calculate the time to live in minutes
      calcTTL() {
        const now = Date.now()
        const expiry = this.decoded.exp * 1000 // convert to milliseconds
        let ttl = (expiry - now) / 1000 / 60  // back to minutes
        return ttl
      },

      refreshToken() {
        // Only fresh is current token is valid, as we need a valid token to pass in Auth header
        let ok = false
        if (this.validateToken(this.token, this.lsTokenKey)) {
          console.log("refreshToken()", "token is valid")
          api.refreshToken()
            .then((r) => {
              this.$localStorage.set("appToken", r.body.token)
              // run validateToken again to set values for the new token
              ok = this.validateToken(this.token, this.lsTokenKey)

            }, (r) => {
              // If the local storage token is tampered with then we end up here
              // with a 401 (unauthorized). This will never resolve because the token refresh
              // requires a valid token to work. So on 401 we should bail out.
              let msg = "Attempt to renew token got a response of " + r.status + " - " + r.statusText
              if (r.status === 401) {
                console.log(r)
                console.log(msg)
                console.log("Will stop trying")
                this.clearAll()
              }
            })

        } else {
          // could not validate the token
          this.clearAll()
          this.stopIntervalCheck()
        }
      },

      // remove all traces of the token
      clearToken() {
        this.$localStorage.remove("appToken")
        this.token = null
        this.decoded = {}
        this.ttl = null
      },

      startIntervalCheck() {

        // Make sure no interval is already running
        this.stopIntervalCheck()

        // Initial call to validateToken() sets local data and returns bool
        if (this.validateToken('', this.lsTokenKey)) {
          console.log("Token is valid, starting interval...")
          this.checkIntervalId = setInterval(() => {
            // validate on each run in case token is changed in local storage
            if (this.validateToken(this.token, this.lsTokenKey)) {
              console.log("TTL is " + this.ttl + " refresh ttl is " + this.refreshTTL)
              if (this.ttl < this.refreshTTL) {
                console.log(" - time to refresh!")
                // need a bool here?
                this.refreshToken()
              } else {
                console.log(" - token is ok")
              }
            } else {
              console.log("Invalid token - stop interval and clear token data")
              this.clearAll()
            }
          }, (this.refreshCheckInterval * 60 * 1000))

        } else {
          console.log("Invalid token - stop interval and clear token data")
          this.clearAll()
        }
      },

      stopIntervalCheck() {
        clearInterval(this.checkIntervalId)
      },

      // clears the interval and all the token data
      clearAll() {
        this.stopIntervalCheck()
        this.clearToken()
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

        this.startIntervalCheck()

        // Listen for succesful login event
        EventBus.$on('login', () => {
          this.startIntervalCheck()
        })

        // Listen for request to open the session dialog
        EventBus.$on('openSessionDialog', () => {
          this.sessionDialog = true
        })
      })
    }
  }
</script>

<style>
</style>