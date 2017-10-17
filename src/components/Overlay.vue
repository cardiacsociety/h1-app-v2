<template>
    <div class="overlay" v-if="show">
        <div class="overlay-content">
            <h3><slot>Working...</slot></h3>
            <v-progress-circular indeterminate v-bind:size="80" color="deep-orange"></v-progress-circular>
        </div>
    </div>
</template>

<script>
    export default {
      props: {

        // how long to show the overlay for, default is infinite
        duration: {
          type: Number,
          default: -1
        },

        // show the 'indeterminate' progress bar, default true
        indeterminate: {
          type: Boolean,
          default: true
        }

      },

      data() {
        return {
          show: false
        }
      },

      mounted() {
        // switch it on...
        this.show = true

        // show forever...
        if (this.duration < 0) {
          return
        }

        // ... or switch off after the specified duration
        const d = this.duration * 1000 // milliseconds
        setTimeout(() => {
          this.show = false
        }, d)
      }
    }
</script>

<style scoped>
    .overlay {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0, 0.5);
    }
    .overlay-content {
        width: 50vw;
        text-align: center;
        color: #ddd;
    }
</style>