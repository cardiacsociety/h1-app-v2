<template>
    <div>
        <h3>Resources</h3>
        {{ checkAuth($route.name) }}
        <ais-index
                :app-id="Config.ALGOLIA_APP_ID"
                :api-key="Config.ALGOLIA_API_KEY"
                :index-name="Config.ALGOLIA_RESOURCES_INDEX"
        >
            <ais-input class="search-input" placeholder="Find resources..."></ais-input>
            <ais-results>
                <template slot-scope="{ result }">
                    <div class="resource-row">
                        <span class="subheading resource-title">
                            <ais-highlight :result="result" attribute-name="name"></ais-highlight>
                        </span><br>
                        <span class="caption">
                            <app-resource-description
                                    :truncate="result.description.length > 600">
                                <ais-highlight :result="result" attribute-name="description"></ais-highlight>
                            </app-resource-description>
                        </span>
                        <div>
                            <app-timer-form
                                    :description="result.name"
                                    :url="result.shortUrl"
                            ></app-timer-form>
                            <v-divider></v-divider>
                        </div>
                    </div>
                </template>
            </ais-results>
        </ais-index>
    </div>
</template>

<script>
  import Config from '../../config/config'
  import {EventBus} from '../../main'
  import ResourceDescription from './ResourceDescription.vue'
  import TimerForm from '../activities/TimerForm.vue'

  export default {

    components: {
      appResourceDescription: ResourceDescription,
      appTimerForm: TimerForm
    },

    data() {
      return {
        Config,
        expand: false
      }
    },

    methods: {
      emit(opt) {
        EventBus.$emit('navEvent', opt)
      },
    }
  }
</script>

<style scoped>
    .search-input {
        margin-bottom: 20px;
        border: solid #ccc 1px;
        border-radius: 5px;
        font-size: 20px;
    }
    .ais-highlight em {
        background-color: yellow;
    }
    .resource-row {
        margin-bottom: 20px;
    }
    .resource-title {
        font-weight: 500;
    }
</style>