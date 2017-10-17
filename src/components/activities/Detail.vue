<template>
    <div>
        {{ checkAuth('activitiesDetail') }}
        <h3>Activity Detail</h3>
        <p>id: {{ id }}</p>
    </div>
</template>

<script>
    export default {
      // can pass url params as props... see route.js
      props: {
        // passed on url
        id: {
          type: Number
        }
      }
    }
</script>

<style>
</style>