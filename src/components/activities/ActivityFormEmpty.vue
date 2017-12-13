<template>
    <div>
        <!--click wrapper as cannot listen for click on a slot-->
        <span @click="openForm">
            <slot name="activator">open form</slot>
        </span>
        <v-dialog v-model="dialog" persistent max-width="500px">

            <h1>EMPTY FORM</h1>


        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
            }
        },

        methods: {
            openForm() {
                this.dialog = true
            },
        }
    }
</script>

<style scoped>
</style>