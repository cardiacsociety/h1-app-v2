<template>
    <div>
        <h3>Resources</h3>
        <ais-index
                :app-id="Config.ALGOLIA_APP_ID"
                :api-key="Config.ALGOLIA_API_KEY"
                :index-name="Config.ALGOLIA_RESOURCES_INDEX"
                :query-parameters="{'page': page, 'snippetEllipsisText': '…'}"
        >
            <ais-input class="search-input" placeholder="search for..."></ais-input>
            <div>
                <p>
                    <ais-stats>
                        <template slot-scope="{ totalResults, processingTime, query }">
                            There are {{ totalResults }} results matching query: <b>{{ query }}</b>
                            - <small>{{ processingTime }}ms</small>
                        </template>
                    </ais-stats>
                </p>
            </div>
            <ais-results :stack="true">
                <template slot-scope="{ result }">
                    <div class="resource-row">
                        <span class="subheading resource-title">
                            <ais-highlight :result="result" attribute-name="name"></ais-highlight>
                        </span><br>
                        <span class="body-1 ref">
                            {{ result.sourceNameAbbrev }}
                            {{ (result.sourcePubDate ? result.sourcePubDate : '') }}
                            {{ (result.sourceVolume ? '; '+result.sourceVolume : '') }}
                            {{ (result.sourceIssue ? '('+result.sourceIssue+')' : '') }}
                            {{ (result.sourcePages ? ': '+result.sourcePages : '') }}
                        </span><br>
                        <span class="caption">
                            <app-resource-description
                                    :truncate="result.description.length > 600">
                                <ais-highlight :result="result" attribute-name="description"></ais-highlight>
                            </app-resource-description>
                        </span>
                        <div>
                            <app-activity-form
                                    :activityTypesData="activityTypes"
                                    :activityData="{description: result.name + '\r\n' + result.shortUrl}"
                            >
                                <v-btn
                                        slot="activator"
                                        class="resource-link"
                                        color="blue darken-1" flat
                                        @click="openResource(result.shortUrl)"
                                >{{ result.shortUrl }}
                                </v-btn>
                            </app-activity-form>
                            <v-divider></v-divider>
                        </div>
                    </div>
                </template>
            </ais-results>

            <div id="loadmore">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                loading more
            </div>
        </ais-index>
    </div>
</template>

<script>
    import Config from '../../config'
    import ScrollMonitor from 'scrollmonitor'

    import ResourceDescription from './ResourceDescription.vue'
    import Form from '../activities/ActivityForm.vue'

    export default {

        components: {
            appResourceDescription: ResourceDescription,
            appActivityForm: Form
        },

        data() {
            return {
                Config,
                expand: false,
                page: 1,
            }
        },

        computed: {
            activityTypes() {
                return this.$store.state.activityTypes
            }
        },

        methods: {

            openResource(url) {
                window.open(url)
            },

            loadMore: function () {
                this.page++;
            },
        },

        mounted() {
            let e = document.getElementById('loadmore')
            let w = ScrollMonitor.create(e)
            w.enterViewport(() => {
                this.loadMore()
            })
        }
    }
</script>

<style scoped>
    .search-input {
        margin-bottom: 20px;
        padding-left: 4px;
        border: solid #ccc 1px;
        border-radius: 5px;
        font-size: 20px;
    }

    .resource-row {
        margin-bottom: 20px;
    }

    .resource-title {
        font-weight: 500;
    }

    .resource-link {
        text-transform: lowercase;
        margin-left: 0px;
    }
    .ref {
        color: #999;
        font-style: italic;
    }
</style>