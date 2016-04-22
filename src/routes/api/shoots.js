var express = require('express'),
  videoHelper = require('../../services/videoHelper'),
  params = require('../../config/params'),
  bootlegger = require('../../services/bootlegger/bootlegger')
  router = express.Router({
    mergeParams: true
  });

/**
 * GET: Shoots
 */
router.get('/', function(req, res) {
  bootlegger.getShoots(req.session.sessionkey)
    .then(function(data) {
      data = JSON.parse(data.body);
      // REMOVE SHOOTS THAT WE ARE NOT THE OWNER FOR
      for (var i = 0; i < data.length; i++)
        if (data[i].status !== "OWNER")
          data.splice(i);
      res.json(data);
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
});

/**
 * GET: Templates
 */
router.get('/templates', function(req, res) {
  bootlegger.getTemplates(req.session.sessionkey)
    .then(function(data) {
      res.json(JSON.parse(data.body));
    })
    .catch(function(err) {
      console.log(err);
      res.status(err.code).send(err);
    });
});

/**
 * GET: Shoot
 */
router.get('/:shoot_id', function(req, res) {
  bootlegger.getShoot(req.session.sessionkey, req.params.shoot_id)
    .then(function(data) {
      res.json(JSON.parse(data.body));
    })
    .catch(function(err) {
      res.status(err.code).send(err);
    });
});

module.exports = router;