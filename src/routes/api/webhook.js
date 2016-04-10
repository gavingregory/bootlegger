var express = require('express')
  , router = express.Router({mergeParams: true})
  , params = require('../../config/params')
  , moment = require('moment')
  , util = require('util')
  , Task = require('../../models/task').model
  , crypto = require('crypto');

/**
 * SHA1 checksum (required by Crowdflower to sign a webhook post)
 */
var SHA1Checksum = function (e) {
  return crypto.createHash('sha1').update(e).digest('hex');
}

// post crowdflower job results
router.post('/', function (req, res) {

  // generate an sha1 checksum of the (payload + api key)
  var sha1 = SHA1Checksum(req.body.payload + params.cf_api);

  // parse payload
  var payload = JSON.parse(req.body.payload);

  console.log(util.inspect(payload, { showHidden: true, depth: null }));
  console.log(sha1);

  // the webhook is valid if the sha1 generated matches the signature of the post
  var valid = req.body.signature === sha1;
  console.log(valid);

  // find task with the task ID
  Task.findOne({_id: payload.data.task_id }, function (err, task) {
    if (err) console.log('error finding a matching task');
    else if (!task) console.log('No task found');
    else {
      console.log('success finding a matching task');
      var row = 0;
      for ( ; row < task.jobs.length; row++) {
        if (task.jobs[row].id === payload.data.id) break;
      }
      task.jobs[row].judgments.push({result: JSON.stringify(payload.results) });
      task.save(function (err, data) {
        if (err) { console.log('error saving the task'); console.log(err); }
        else console.log('SUCCESSFULLY RETRIEVED A JUDGMENT' + payload.results);
        res.status(200).send(sha1);   
      });
    }
  });
});

module.exports = router;
