var requestify = require('requestify'),
	params     = require('../../config/params'),
  	qlimit     = require('qlimit'), // limit concurrent promises
  	limit      = qlimit(10);          // to 10

module.exports = {

	/**
	 * Gets a 'secure URL' from the Bootlegger API
	 * @param   {String} session_key
	 * @param   {String} video_id
	 * @returns {Object} a promise object
	 */
	getSecureVideoUrl : limit(function (session_key, video_id) {
		console.log('BOOTLEGGER: SECURE URL FUNCTION');
    return requestify.head(params.bootlegger_media_url(video_id), { cookies: { 'sails.sid': session_key } });
	}),

	/**
	 * Gets a shoot from the Bootlegger API
	 * @param   {String} session_key
	 * @param   {String} video_id
	 * @returns {Object} a promise object
	 */
	getShoot : limit(function (session_key, video_id) {
		console.log('BOOTLEGGER: GET SHOOT FUNCTION');
		return requestify.get(params.bootlegger_api_url + '/api/media/shoot/' + video_id + '?apikey=' + params.bootlegger_api_key, { cookies: { 'sails.sid': session_key } });
	}),

	/**
	 * Gets array of Shoots from the Bootlegger API
	 * @param   {String} session_key
	 * @returns {Object} a promise object
	 */
	getShoots : limit(function (session_key) {
		console.log('BOOTLEGGER: GET SHOOTS FUNCTION');
		return requestify.get(params.bootlegger_api_url + '/api/profile/mine?apikey=' + params.bootlegger_api_key, { cookies: { 'sails.sid': session_key } });
	}),

	/**
	 * Gets the list of available templates from the Bootlegger API
	 * @param   {String} session_key
	 * @returns {Object} a promise object
	 */
	getTemplates : limit(function (session_key) {
		console.log('BOOTLEGGER: GET TEMPLATE FUNCTION');
		return requestify.get(params.bootlegger_api_url + '/api/commission/shots?apikey=' + params.bootlegger_api_key, { cookies: { 'sails.sid': session_key } });
	}),

	/**
	 * Gets the profile of the currently logged in user from the Bootlegger API
	 * @param   {String} session_key
	 * @returns {Object} a promise object
	 */
	getProfile : limit(function (session_key) {
		console.log('BOOTLEGGER: GET PROFILE');
		return requestify.get(params.bootlegger_api_url + '/api/profile/me?apikey=' + params.bootlegger_api_key, { cookies: { 'sails.sid' : session_key } });
	})
}