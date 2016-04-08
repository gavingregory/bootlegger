var express = require('express')
  , requestify = require('requestify')
  , videoHelper = require('../../services/videoHelper')
  , params = require('../../config/params')
  , router = express.Router({mergeParams: true})

// get secure video url
router.get('/media/:video_id', function (req, res) {
  var url = params.bootlegger_media_url(req.params.video_id);

  requestify.head(url, { cookies: {'sails.sid' : req.session.sessionkey} })
    .then(function (response) {
      var message = 'ERROR: should not actually succeed, we are expecting a 302 redirect code here!';
      console.log(message);
      res.send(message);
    })
    .catch(function (response) {
      if (response.code === 302) {
        res.send(response.headers.location);
      } else {
      var message = 'ERROR: not a 302?!';
      console.log(message);
      res.send(message);
      }
    });
});

// get shoots
router.get('/', function (req, res) {
  requestify.get(params.bootlegger_api_url + '/api/profile/mine?apikey=' + params.bootlegger_api_key,
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
  requestify.get(params.bootlegger_api_url + '/api/media/shoot/' + req.params.shoot_id + '?apikey=' + params.bootlegger_api_key,
  { cookies: {'sails.sid' : req.session.sessionkey} })
    .then(function (data) {
      res.json(JSON.parse(data.body));
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

module.exports = router;
