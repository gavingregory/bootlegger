var express = require('express')
  , multer = require('multer')
  , requestify = require('requestify')
  , mime = require('mime')
  , params = require('../../config/params')
  , router = express.Router({mergeParams: true})
  , moment = require('moment')
  , videoHelper = require('../../services/videoHelper')
  , Task = require('../../models/task').model
  , crowdflower = require('../../services/crowdflower/Crowdflower')(params.cf_api)
  , qs = require('querystring')
  , Job = require('../../services/crowdflower/Job');

// post crowdflower job results
router.post('/', function (req, res) {

  console.log(req.body);
  res.status(200).send('ok');

});

module.exports = router;
