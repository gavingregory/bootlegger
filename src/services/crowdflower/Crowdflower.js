/**
 * Module dependencies
 */
var requestify = require('requestify'),
  qs = require('querystring'),
  Job = require('./Job');

//var defaultCML = '<img src="https://crowd.bootlegger.tv/crowd/image/{{task_id}}/0" />\n<iframe src="https://crowd.bootlegger.tv/crowd/video/{{video_path}}/{{video_start}}/{{video_end}}" frameBorder="0" width="100%" height="100%" style="height: 320px; width: 100%;"></iframe>\n<cml:radios validates="required" label="I have located a whisper in the video footage:">\n<cml:radio label="Yes" value="true"></cml:radio>\n<cml:radio label="No" value="false"></cml:radio>\n<cml:radio label="I am unable to verify" value="na"></cml:radio>\n</cml:radios>'
var defaultCML = 'test';

/**
 * Constants
 */
const METHOD_POST = 'POST';
const METHOD_GET = 'GET';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';

var key = null;

module.exports = function (k) {
  'use strict';

  // set key if key is issued as a parameter
  function setKey (_key) {
    if (_key) key = _key;
  }
  setKey(k);

  /**
   * Request Options
   */
  function RequestOptions (url) {
    this.options = {
      method: METHOD_GET,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        'key': key
      },
      dataType: 'form-url-encoded'
    };
    this.url = 'https://api.crowdflower.com/v1/' + url;
  };

  /**
   * Get all jobs current associated with the api key provided
   *
   * @param {String} key
   * @return {Object}
   */
  var getAllJobs = function (key) {
    return fetch(new RequestOptions('jobs.json'));
  };

  /**
   * Get the account info associated with the provided key.
   * This also provides balance info
   *
   * @param {String} key
   */
  var getAccountInfo = function (key) {
    return fetch(new RequestOptions('account.json'));
  };

  /**
   * Create a job with the specified parameters
   *
   * @param {Object} params
   * @return {Object}
   */
  var createJob = function (job) {
    var r = new RequestOptions('jobs.json');
    r.options.method = METHOD_POST;
    r.options.params['job[title]'] = job['job[title]'] || 'Default Title';
    r.options.params['job[instructions]'] = job['job[instructions]'] || 'Default Instructions';
    r.options.params['job[cml]'] = job['job[cml]'] || defaultCML;
    r.options.params['job[css]'] = job['job[css]'] || 'body { color: #101010; }';
    r.options.params['job[js]'] = job['job[js]'] || ' ';
    r.options.params['job[support_email]'] = job['job[support_email]'] || ' ';
    r.options.params['job[payment_cents]'] = job['job[payment_cents]'] || 1;
    r.options.params['job[units_per_assignment]'] = job['job[units_per_assignment]'] || 1;
    r.options.params['job[judgments_per_unit]'] = job['job[judgments_per_unit]'] || 1;
    r.options.params['job[time_per_page]'] = job['job[time_per_page]'] || 0;

    return fetch(r).then(function (data) {
      if (data.code != 200) throw new Error('invalid response code.');
      var parsed = JSON.parse(data.body);
      if (!parsed.id) throw new Error('no job ID, job not created.');
      return uploadUnits(parsed.id, job.getCrowdflowerUnits());
    });
  };

  /**
   * Delete the given job.
   *
   * @param {String} jobId
   * @return {Object}
   */
  var deleteJob = function (jobId) {
    //https://api.crowdflower.com/v1/jobs/900318.json?key=vcHXAQLo4Q4LvMv4Ks8X
    var r = new RequestOptions('jobs/' + jobId + '.json');
    r.options.method = METHOD_DELETE;
    return fetch(r);
  };

  /**
   * Updates a job with the provided parameters
   *
   * @param {String} jobId
   * @param {Object} params
   * @return {Object}
   */
  var updateJob = function (jobId, params) {
    var r = new RequestOptions('jobs/' + jobId + '.json');
    r.options.method = METHOD_PUT;
    if (params.title) r.options.params['job[title]'] = params.title;
    if (params.title) r.options.params['job[instructions]'] = params.instructions;
    if (params.title) r.options.params['job[cml]'] = params.cml;
    if (params.title) r.options.params['job[css]'] = params.css;
    if (params.title) r.options.params['job[js]'] = params.js;
    return fetch(r);
  };

  /**
   * Uploads rows for the job
   *
   * @param {String} jobId
   * @param {Object} data
   * @return {Object}
   */
  var uploadUnits = function (jobId, data) {
    var r = new RequestOptions('jobs/' + jobId + '/upload.json');
    r.options.method = METHOD_PUT;
    r.options.dataType = 'string'; // avoid json parser as crowdflower uses non-standard json and FAILS in parser
    r.options.body = data;
    return fetch(r);
  };

  /**
   * Retrieves a brief summary and status of the given job.
   *
   * @param {String} jobId
   * @return {Object}
   */
  var pingJob = function (jobId) {
    var r = new RequestOptions('jobs/' + jobId + '/ping.json');
    return fetch(r);
  };

  /**
   * Retrieves detailed information about the given job from Crowdflower.
   *
   * @param {String} jobId
   * @return {Object}
   */
  var getJob = function (jobId) {
    var r = new RequestOptions('jobs/' + jobId + '.json');
    return fetch(r);
  };

  /**
   * Retrieves the units of the given job.
   *
   * @param {String} jobId
   * @return {Object}
   *
   */
  var getUnits = function (jobId) {
    var r = new RequestOptions('jobs/' + jobId + '/units.json');
    return fetch(r);
  }

  /**
   * Retrieves information about the units of a given job.
   *
   * @param {String} jobId
   * @return {Object}
   */
  var pingUnits = function (jobId) {
    var r = new RequestOptions('jobs/' + jobId + '/units/ping.json');
    return fetch(r);
  }

  /**
   * Cancel the given job.
   * Note, this does not remove a job, just cancels a RUNNING job
   * Job must be running to be cancelled
   *
   * @param {String} jobId
   * @return {Object}
   */
  var cancelJob = function (jobId) {
    // YES, leave this as a GET method! ???
    var r = new RequestOptions('jobs/' + jobId + '/cancel.json');
    return fetch(r);
  };

  /**
   * Gets the results of the job.
   * @param {String} jobId
   * @param {Number} page
   * @return {Object}
   */
  var getResults = function (jobId, page) {
    //https://api.crowdflower.com/v1/jobs/{job_id}/judgments.json?key={api_key}&page={1}
    var r = new RequestOptions('jobs/' + jobId + '/judgments.json');
    r.options.params.page = page;
    return fetch(r);
  }

  /**
   * Returns a requestify promise (use .then(resp) and .catch(err) on the
   * return promise to handle the responses.)
   *
   * @param {Object} param The return object from one of the
   *                 builder functions above
   * @return {Object}
   */
  var fetch = function (param) {
    return requestify.request(param.url, param.options);
  }

  /**
   * Module API
   */
  var api = {
    setKey: setKey,
    getAllJobs: getAllJobs,
    getAccountInfo: getAccountInfo,
    createJob: createJob,
    deleteJob: deleteJob,
    updateJob: updateJob,
    getUnits: getUnits,
    uploadUnits: uploadUnits,
    pingJob: pingJob,
    getJob: getJob,
    pingUnits: pingUnits,
    cancelJob: cancelJob,
    getResults: getResults
  };
  return api;
};
