module.exports = {

  /**
   * the bootlegger API url
   */
  bootlegger_api_url: 'https://bootlegger.tv',

  /**
   * the bootlegger API key
   */
  bootlegger_api_key: 'key',

  /**
   * the url to the bootlegger media redirect API endpoint. this endpoint returns a 302
   * and a location to a media object (with all of the required querystring parameters to allow
   * a user to access the video without being logged in ...)
   */
   bootlegger_media_url: function (id) {
  	return 'https://bootlegger.tv/media/full/' + id;
  },

  /**
   * the crowdflower API key
   */
  cf_api: 'key',
  //cf_api: 'vcHXAQLo4Q4LvMv4Ks8X',

  /**
   * the crowdflower API url
   */
  cf_url: 'https://api.crowdflower.com/v1/jobs.json',

  /**
   * the session secret key
   */
  sessionsecret: 'secret'
}
