var express = require('express')
  , router = express.Router({mergeParams: true})
  , Task = require('../../models/task').model
  , path = require('path')
  , swig = require('swig')
  , qs = require('querystring')
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
router.get('/video/:task_id/:video_id/:start/:end', function (req, res) {
  // find the task by the task id provided

  Task.findById(req.params.task_id, function (err, data) {
      if (err) return res.send('Unfortunately there has been an error loading this video.');

      for (var i = 0; i < data.jobs.length; i++) {
        if (data.jobs[i].video.bootlegger_id === req.params.video_id) {
          return res.render('video.html', {
            start_time: req.params.start,
            end_time: req.params.end,
            video: data.jobs[i].video.path
          });
        }
      }

      // it seems a video has not been found
      return res.send('Unfortunately that video Id was not found on the server.');
  });

});

// Get Video for use in Crowdflower IFrame
// This new method sends the video path as a query string paramter
// this needs to be decoded!
router.get('/video/:start/:end/', function (req, res) {
  if (!req.query.path) return res.send('Unfortunately that video is invalid.');
  return res.render('video.html', {
    start_time: req.params.start,
    end_time: req.params.end,
    video: qs.unescape(req.query.path)
  });

});

module.exports = router;
