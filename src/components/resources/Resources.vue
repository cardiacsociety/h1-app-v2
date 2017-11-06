<template>
    <div>
        <h3>Resources</h3>
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
                            <app-activity-form
                                    :activityTypes="activityTypes"
                                    :description="result.name"
                                    :url="result.shortUrl"
                            ></app-activity-form>
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
  import api from '../../api/mapp'

  import ResourceDescription from './ResourceDescription.vue'
  import Form from '../activities/Form.vue'

  export default {

    components: {
      appResourceDescription: ResourceDescription,
      appActivityForm: Form
    },

    data() {
      return {
        Config,
        expand: false,

        // list of activity types get passed to form as props. Had as computed
        // but was then called for every row and was returning empty, sometimes?
        activityTypes: null
      }
    },

    methods: {
      fetchActivityTypes() {
        this.activityTypes = api.getActivityTypes()
      }
    },

    mounted() {
      this.fetchActivityTypes()
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