<template>
    <v-fab-transition>
        <v-btn
                fixed
                dark
                fab
                class="fab orange darken-4"
                v-show="!show"
        >
            <v-icon>add</v-icon>
        </v-btn>
    </v-fab-transition>
</template>

<script>
  export default {
    data() {
      return {
        show: false
      }
    }
  }
</script>

<style scoped>
    /* fab absolute */
    .fab {
        bottom: 1.5rem;
        right: 1.5rem;
    }

    @media (min-width: 1024px) {
        .fab {
            top: 85px;
            right: 30px;
        }
    }
</style>