<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 sm10 lg6>

                <v-card flat>
                    <v-card-title primary-title>
                        <div class="headline">HAS-BLED Score for Major Bleeding Risk</div>
                        <div class="grey--text">Estimates risk of major bleeding for patients on anticoagulation
                            to assess risk-benefit in atrial fibrillation care.
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-layout wrap>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Hypertension</div>
                                <div class="caption grey--text">Uncontrolled, >160 mmHg systolic</div>
                                <v-radio-group row v-model="ht">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Renal disease</div>
                                <div class="caption grey--text">Dialysis, transplant, Cr >2.26 mg/dL or >200 µmol/L
                                </div>
                                <v-radio-group row v-model="rd">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Liver disease</div>
                                <div class="caption grey--text">Cirrhosis or bilirubin >2x normal with AST/ALT/AP >3x
                                    normal
                                </div>
                                <v-radio-group row v-model="ld">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Stroke history</div>
                                <div class="caption grey--text"></div>
                                <v-radio-group row v-model="sh">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Bleeding</div>
                                <div class="caption grey--text">Prior major bleeding or predisposition to bleeding</div>
                                <v-radio-group row v-model="bl">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Labile INR</div>
                                <div class="caption grey--text">Unstable/high INRs, time in therapeutic range <60%</div>
                                <v-radio-group row v-model="li">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Age >65</div>
                                <div class="caption grey--text"></div>
                                <v-radio-group row v-model="age">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Medication usage predisposing to bleeding</div>
                                <div class="caption grey--text">Antiplatelet agents, NSAIDs</div>
                                <v-radio-group row v-model="med">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                            <v-flex xs12>
                                <v-divider class="mb-3"></v-divider>
                                <div class="subheading">Alcohol use</div>
                                <div class="caption grey--text">8+ drinks per week</div>
                                <v-radio-group row v-model="alc">
                                    <v-radio label="No" value="0"></v-radio>
                                    <v-radio label="Yes" value="1"></v-radio>
                                </v-radio-group>
                            </v-flex>

                        </v-layout>
                        <v-alert color="grey darken-1" :value="true">
                            <v-layout>
                                <v-flex xs12>
                                    <h5 class="headline">Score: {{ score }}</h5>
                                    <p>{{ risk }}</p>
                                    <p>{{ recommendation }}</p>
                                </v-flex>
                            </v-layout>
                        </v-alert>
                    </v-card-text>

                    <v-card-text class="caption grey--text">
                        <p>
                            <sup>1</sup> <a href="https://doi.org/10.1016/j.jacc.2010.09.024" target="_blank">
                            https://doi.org/10.1016/j.jacc.2010.09.024</a>
                        </p>
                        <p>
                            <sup>2</sup> <a href="http://dx.doi.org/10.1378/chest.10-0134" target="_blank">
                            http://dx.doi.org/10.1378/chest.10-0134</a>
                        </p>
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
        ht: 0,
        rd: 0,
        ld: 0,
        sh: 0,
        bl: 0,
        li: 0,
        age: 0,
        med: 0,
        alc: 0,

        // Risk from two validation studies
        risk1: [0.9, 3.4, 4.1, 5.8, 8.9, 9.1],
        risk2: [1.13, 1.02, 1.88, 3.74, 8.7, 12.5],
        suggestions: [
          "Anticoagulation should be considered - relatively low risk for major bleeding (~1/100 patient-years)",
          "Anticoagulation should be considered - relatively low risk for major bleeding (~1/100 patient-years)",
          "Anticoagulation can be considered, however moderate risk for major bleeding (~2/100 patient-years)",
          "Alternatives to anticoagulation should be considered - high risk for major bleeding."
        ]
      }
    },

    computed: {
      score() {
        return (
          parseInt(this.ht) +
          parseInt(this.rd) +
          parseInt(this.ld) +
          parseInt(this.sh) +
          parseInt(this.bl) +
          parseInt(this.li) +
          parseInt(this.age) +
          parseInt(this.med) +
          parseInt(this.alc)
        )
      },

      // risk reported by two separate validation studies, so this returns a computed comment
      // based on the score
      risk() {
        let s = ""
        if (this.score <= 5) {
          s = "Risk " + this.risk1[this.score] + "%\u00B9, " +
            this.risk2[this.score] + " bleeds per 100 patient-years\u00B2"
        } else {
          s = "No data, risk likely to be great than 10%."
        }
        return s
      },

      recommendation() {
        let s = ""
        if (this.score < 3) {
          s = this.suggestions[this.score]
        } else {
          s = this.suggestions[3]
        }

        return s
      }
    }
  }
</script>

<style>

</style>