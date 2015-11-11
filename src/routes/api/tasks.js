var express = require('express')
  , multer = require('multer')
  , mime = require('mime')
  , router = express.Router({mergeParams: true})
  , moment = require('moment')
  , videoHelper = require('../../services/videoHelper')
  , Task = require('../../models/task').model;

// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
  }
});
var upload = multer({storage:storage});

// get all tasks
router.get('/', function (req, res) {
  Task.find({shoot_id: req.params.shoot_id}, function (err, data) {
    if (err) { return res.send(err); }
    return res.send(data);
  });
});

// post a new task
router.post('/', upload.single('file'), function (req, res) {
  var t = new Task(req.body);
  t.ref_images.push(req.file);

  var videos = req.body.videos;
  // iterate over videos
  var id = 0; // id for each job
  for (var i = 0; i < videos.length; i++) {
    videoHelper.distributeVideoIndexes(videos[i].meta.static_meta.clip_length, req.body.segment_size, function (result) {

      for (j = 0; j < result.segments.length; j++) {
        var o = {
          id: id++,
          video: {
            index : i,
            start : result.segments[j].start,
            end: result.segments[j].end,
            filename: videos[i].meta.static_meta.local_filename,
            path: videos[i].path,
            length: videoHelper.durationToMillis(videos[i].meta.static_meta.clip_length),
            filesize: videos[i].meta.static_meta.filesize
          }
        };
        t.jobs.push(o);
      }
    });
  }
  console.log(t.jobs);
  t.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }
    return res.json({status: 'success'});
  });
});

router.get('/:task_id', function (req, res) {
  Task.findOne({shoot_id: req.params.shoot_id, _id: req.params.task_id }, function (err, data) {
    if (err) { return res.status(400).send(err); }
    return res.json(data);
  })
})

module.exports = router;
