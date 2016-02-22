
/**
 * Constructor for the Job object
 * @param {Object} options - The job options.
 * @param {string} options.title - The title of the job.
 * @param {string} options.instructions - The instructions given to the crowdflower worker.
 * @param {string} options.cml - The job's crowdflower markup langage(CML).
 * @param {string} options.css - The job's cascading style sheet(CSS).
 * @param {string} options.js - The job's javascript.
 * @param {string} options.support_email - The email address to be contacted for support regarding this job.
 * @param {number} options.payment_cents - The payment (in USD cents) for successful completion of each unit of work for this job.
 * @param {number} options.units_per_assignment - The units per asignment.
 * @param {number} options.judgments_per_unit - The judgements per unit.
 * @param {number} options.time_per_page - The time given per page.
 * @param {Object[]} options.units - Each unit is a unit of work.
 * @constructor
 */
function Job(options) {

  if (!options) throw new TypeError('options Object is required.');
  if (!options.title) throw new TypeError('title is mandetory to create a job object');
  if (!options.instructions) throw new TypeError('instructions are mandetory to create a job object');
  if (options.units)
    if (!Array.isArray(options.units))
      throw new TypeError('units must be a valid array');

    this['job[title]'] = options.title;
    this['job[instructions]'] = options.instructions;
    this['job[cml]'] = options.cml || '';
    this['job[css]'] = options.css || '';
    this['job[js]'] = options.js || '';
    this['job[support_email]'] = options.support_email || '';
    this['job[payment_cents]'] = options.payment_cents || 1;
    this['job[units_per_assignment]'] = options.units_per_assignment || 1;
    this['job[judgments_per_unit]'] = options.judgments_per_unit || 1;
    this['job[time_per_page]'] = options.time_per_page || '';
    this.units = (options.units) ? options.units.slice(0) : [];
}

/**
 * Returns units parsed as 'crowdflower json'
 * The crowdflower API (bless it) claims it requires valid JSON
 * however accepts units as a JSON object on each line.
 * This function takes an array of JSON objects and builds the required string
 * that should be compatible with the API.
 * @returns {string}
 */
Job.prototype.getCrowdflowerUnits = function () {
  var s = '';
  for (var i = 0; i < this.units.length; i++) {
    s += (JSON.stringify(this.units[i]) + '\n');
  }
  return s;
};

module.exports = Job;
