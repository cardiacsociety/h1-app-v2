<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 sm8 md4>

                <v-card>
                    <v-card-title primary-title>
                        <div class="headline">CHA₂DS₂-VASc Score for Atrial Fibrillation Stroke Risk</div>
                        <div>Calculates stroke risk for patients with atrial fibrillation.</div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout wrap>

                            <v-flex xs12>
                                <v-radio-group label="Age" row v-model="age">
                                    <v-radio label="<65" value="0"></v-radio>
                                    <v-radio label="65-74" value="1"></v-radio>
                                    <v-radio label="75+" value="2"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>


                            <v-flex xs12>
                                <v-radio-group label="Sex" row v-model="sex">
                                    <v-radio label="Male" value="0"></v-radio>
                                    <v-radio label="Female" value="1"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>

                            <v-flex xs12>
                                <v-radio-group label="Congestive Heart Failure history" row v-model="chf">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>

                            <v-flex xs12>
                                <v-radio-group label="Hypertension history" row v-model="ht">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>

                            <v-flex xs12>
                                <v-radio-group label="Stroke/TIA/TE history" row v-model="stt">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="2"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>

                            <v-flex xs12>
                                <v-radio-group label="Vascular Disease history" row v-model="vd">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                                <v-divider></v-divider>
                            </v-flex>

                            <v-flex xs12>
                                <v-radio-group label="Diabetes history" row v-model="diabetes">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>


                        </v-layout>
                        <v-alert color="warning" :value="true">
                            <v-layout>
                                <v-flex xs6>
                                    <span class="headline">Score: {{ score }}</span>
                                </v-flex>
                                <v-flex xs6 text>
                                    <span class="headline">Risk: {{ risk[score] }}%</span>
                                </v-flex>
                            </v-layout>
                        </v-alert>
                    </v-card-text>

                </v-card>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    data() {
      return {
        age: 0,
        sex: 0,
        chf: 0,
        ht: 0,
        stt: 0,
        vd: 0,
        diabetes: 0,

        // annual risk %, score is the index
        risk: [0, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 12.5, 15.2]
      }
    },

    computed: {
      score() {
        return (
          parseInt(this.age) +
          parseInt(this.sex) +
          parseInt(this.chf) +
          parseInt(this.ht) +
          parseInt(this.stt) +
          parseInt(this.vd) +
          parseInt(this.diabetes)
        )
      }
    }
  }
</script>

<style>

</style>