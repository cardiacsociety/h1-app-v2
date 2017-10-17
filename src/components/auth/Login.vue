<template>
    <v-form>
        <app-overlay v-if="overlay">Authenticating...</app-overlay>
        <div v-if="!token">
            <v-card color="grey lighten-4" flat>
                <v-card-title>
                    <h3 class="headline mb-0">Login</h3>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                        <v-layout row>
                            <v-flex xs12 sm10 md8 lg6 xl4>
                                <v-text-field
                                        label="Primary Email"
                                        v-model="auth.login"
                                        required
                                ></v-text-field>
                                <v-text-field
                                        label="Password"
                                        v-model="auth.password"
                                        required
                                ></v-text-field>
                                <v-btn class="" v-on:click="submit">login</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </div>
        <div v-else>
            <p>Store this token in local storage and then redirect to root...</p>
            <p>{{ token }}</p>
            <md-button class="md-raised md-primary" v-on:click="token = null">log out</md-button>
        </div>
    </v-form>
</template>

<script>
  import Overlay from '../Overlay.vue'

  export default {
    components: {
      appOverlay: Overlay
    },

    data() {
      return {

        // passed to api for authentication
        auth: {
          login: '',
          password: ''
        },

        overlay: false,
        message: null,
        token: null,
      }
    },

    computed: {
      // go here after authentication
      redirect() {
        return this.$route.query.to || 'home'
      }
    },

    methods: {
      submit() {
        this.overlay = true
        this.$http.post('auth/member', this.auth)
          .then(r => {
            this.message = r.body.message
            this.token = r.body.data.token
            this.overlay = false

            // token
            console.log('Setting appToken after login...')
            this.$localStorage.set('appToken', this.token)

            // redirect
            this.$router.push({name: this.redirect})

            console.log(r)

          }, r => {
            // error callback
            this.message = r.body.message
            this.overlay = false
            console.log(r)
          })
      }
    }
  }
</script>

<style scoped>

</style>