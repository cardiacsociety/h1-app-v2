const config = {
  ALGOLIA_APP_ID: "MZQPVRPXFY",
  ALGOLIA_API_KEY: "b2870abe304ad95866629a6713fd6e91",
  ALGOLIA_RESOURCES_INDEX: "RESOURCES"
}
if (process.env.NODE_ENV === 'production') {
  config.API_BASE_URL = "https://mappcpd-csanz-web-services.herokuapp.com/v1"
} else {
  config.API_BASE_URL = "http://localhost:5000/v1"
}
module.exports = config