var express = require('express')
  , requestify = require('requestify')
  , videoHelper = require('../../services/videoHelper')
  , params = require('../../config/params')
  , router = express.Router({mergeParams: true})

// get shoots
router.get('/', function (req, res) {
  requestify.get(params.apiurl + '/api/profile/mine?apikey=' + params.apikey,
  { cookies: {'sails.sid' : req.session.sessionkey} })
    .then(function (data) {
      data = JSON.parse(data.body);
      for (var i = 0; i < data.length; i++) {
        if (data[i].status !== "OWNER")
          data.splice(i);
      }
      res.json(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

// get shoot
router.get('/:shoot_id', function (req, res) {
  requestify.get(params.apiurl + '/api/media/shoot/' + req.params.shoot_id + '?apikey=' + params.apikey,
  { cookies: {'sails.sid' : req.session.sessionkey} })
    .then(function (data) {
      res.json(JSON.parse(data.body));
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

router.get('/:task_id', function (req, res) {
  Task.findOne({shoot_id: req.params.shoot_id, _id: req.params.task_id }, function (err, data) {
    if (err) return res.status(400).send(err);
    console.log('cf job id: ' + data.cf_job_id);
    crowdflower.pingJob(data.cf_job_id)
      .then(function (cf_data) {
        var r = {};
        r.data = data;
        r.cf = cf_data.body;
        return res.json(r);
      })
      .catch(function (err) {
        console.log('catch err')
        return res.status(400).send(err);
      });
  })
});

module.exports = router;
