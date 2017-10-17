<template>
    <div>
        {{ checkAuth('activitiesAdd') }}
        <h1>Add New Activity</h1>
        <app-form></app-form>
    </div>
</template>

<script>
    import Form from './Form.vue'

    export default {
      components: {
        appForm: Form
      }
    }
</script>

<style>
</style>