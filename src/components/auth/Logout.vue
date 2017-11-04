<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent>
            <v-card>
                <v-card-title class="headline">End Session</v-card-title>
                <v-card-text>Are you sure you want to logout?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="logout">Yes</v-btn>
                    <v-btn color="primary" flat @click.native="cancel">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {

      data() {
        return {
          dialog: true
        }
      },

      methods: {
        logout() {
          this.dialog = false
          this.$localStorage.remove('appToken')
          this.$router.push('/login')
        },
        cancel() {
          this.dialog = false
          let path = this.$route.query.from
          if (!path) {
            path ="/"
          }
          this.$router.push(path)
        }
      },

    }
</script>

<style>
</style>