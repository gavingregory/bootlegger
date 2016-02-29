var express = require('express')
  , router = express.Router({mergeParams: true})
  , Task = require('../../models/task').model
  , path = require('path')
  , swig = require('swig')
  , params = require('../../config/params.js');


swig.setDefaults({ cache: false });

// Get Reference Image for use in Crowdflower Job
router.get('/image/:taskid/:i?', function (req, res) {
  if (req.params.i === undefined) req.params.i = 0;
  Task.findById(req.params.taskid, function (err, data) {
    if (err) return res.status(404).send('404 task not found.');
    if (req.params.i >= data.ref_images.length) return res.status(404).send('404 image index not found.');
    return res.sendFile(data.ref_images[req.params.i].path, { root: path.join(__dirname, '../../../') });
  });
});

// Get Video for use in Crowdflower IFrame

router.get('/video/:taskid/:jobid', function (req, res) {
  res.render('video.html', {
    start_time: 6,
    end_time: 8
  });
});

module.exports = router;
