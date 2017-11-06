<template>
    <v-form>
        <app-overlay v-if="overlay">Authenticating...</app-overlay>
        <v-alert color="error" icon="warning" v-model="errorAlert" dismissible>
            Auth Error: {{ errorMessage }}
        </v-alert>
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
                                        :append-icon="maskPassword ? 'visibility_off' : 'visibility'"
                                        :append-icon-cb="() => (maskPassword = !maskPassword)"
                                        :type="maskPassword ? 'password' : 'text'"
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
            <p>Already logged in</p>
        </div>
    </v-form>
</template>

<script>
  import Overlay from '../Overlay.vue'
  import { EventBus } from '../../main'
  import api from '../../api/mapp'

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
        maskPassword: true,
        overlay: false,
        message: null,
        token: null,
        errorAlert: false,
        errorMessage: null
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

        api.auth(this.auth.login, this.auth.password)
          .then((r) => {
            this.overlay = false
            this.$localStorage.set('appToken', r.body.data.token)
            EventBus.$emit('login')
            this.$router.push({name: this.redirect})
          }, (r) => {
            this.overlay = false
            this.errorAlert = true
            this.errorMessage = this.sensibleErrorMessage(r)
          })
      },

      // Format auth error, handle the 'no response' case nicely
      sensibleErrorMessage(r) {
        // No response from api
        if (r.status === 0) {
          return "No response from authentication service"
        // response
        } else {
          return this.errorMessage = r.status + ' - ' + r.statusText
        }
      },

    },
  }
</script>

<style scoped>

</style>