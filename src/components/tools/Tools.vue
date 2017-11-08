<template>
    <div>
        <h3>Tools</h3>
        <v-list>
            <template v-for="tool in tools">
                <v-btn flat :key="tool.name" v-on:click="tool.dialog = true" >{{ tool.name }}</v-btn>

                    <v-dialog v-model="tool.dialog"
                              fullscreen
                              transition="dialog-bottom-transition"
                              :overlay=false
                              scrollable>
                        <v-card>
                            <v-toolbar style="flex: 0 0 auto;" dark class="primary">
                                <v-btn icon @click.native="tool.dialog = false" dark>
                                    <v-icon>close</v-icon>
                                </v-btn>
                                <v-toolbar-title>{{ tool.name }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                    <v-btn dark flat @click.native="tool.dialog = false">Close</v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <v-card-text class="pa-0">
                                <component :is="tool.component"></component>
                            </v-card-text>

                            <div style="flex: 1 1 auto;"></div>
                        </v-card>
                    </v-dialog>

            </template>
        </v-list>
    </div>
</template>

<script>
  import AuAbsRisk from './Au_Abs_Risk.vue'
  import CHA2DS2_Vasc from './CHA2DS2_VASc.vue'
  import CreatinineClearance from './CreatinineClearance.vue'
  import DLCNS from './DLCNS.vue'
  import HASBLED from './HAS_BLED.vue'

  export default {

    components: {
      appAuAbsRisk: AuAbsRisk,
      appCHA2DS2: CHA2DS2_Vasc,
      appCreatinineClearance: CreatinineClearance,
      appDLCNS: DLCNS,
      appHASBLED: HASBLED,
    },

    data() {
      return {
        tools: [
          {
            name: "Australian Absolute Cardiovascular Risk",
            component: "appAuAbsRisk",
            dialog: false,
          },
          {
            name: "CHA₂DS₂-VASc",
            component: "appCHA2DS2",
            dialog: false,
          },
          {
            name: "Creatinine Clearance",
            component: "appCreatinineClearance",
            dialog: false,
          },
          {
            name: "DUTCH LIPID",
            component: "appDLCNS",
            dialog: false,
          },
          {
            name: "HAS-BLED",
            component: "appHASBLED",
            dialog: false,
          },
        ]
      }
    },

    methods: {}
  }
</script>

<style>

</style>