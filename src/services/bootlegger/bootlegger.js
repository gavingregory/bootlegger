var requestify = require('requestify'),
		params 		 = require('../../config/params'),
  	qlimit 		 = require('qlimit'), // limit concurrent promises
  	limit 		 = qlimit(10);          // to 10

module.exports = {

	/**
	 * Gets a 'secure URL' from the Bootlegger API
	 * returns a promise
	 */
	getSecureVideoUrl : limit(function(session_key, video_id) {
		console.log('BOOTLEGGER: SECURE URL FUNCTION');
    return requestify.head(params.bootlegger_media_url(video_id), { cookies: { 'sails.sid': session_key } });
	}),

	/**
	 * Gets a shoot from the Bootlegger API
	 * returns a promise
	 */
	getShoot : limit(function(session_key, video_id) {
		console.log('BOOTLEGGER: VIDEO SHOOT FUNCTION');
		return requestify.get(params.bootlegger_api_url + '/api/media/shoot/' + video_id + '?apikey=' + params.bootlegger_api_key, { cookies: { 'sails.sid': session_key } });
	})
}