var express = require('express')
  , multer = require('multer')
  , requestify = require('requestify')
  , mime = require('mime')
  , params = require('../../config/params')
  , router = express.Router({mergeParams: true})
  , moment = require('moment')
  , videoHelper = require('../../services/videoHelper')
  , Task = require('../../models/task').model
  , crowdflower = require('../../node-crowdflower/index')(params.cf_api)
  , Job = require('../../node-crowdflower/lib/Job');

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
router.post('/', function (req, res) {

  var t = new Task(req.body);
  var videos = req.body.videos;

  // iterate over videos
  var id = 0; // id for each job
  for (var i = 0; i < videos.length; i++) {
    videoHelper.distributeVideoIndexes(videos[i].meta.static_meta.clip_length, req.body.segment_size, function (result) {
      console.log('segments length: ' + result.segments.length);
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
        console.log('pushing o');
        t.jobs.push(o);
      }
    });
  }
  t.save(function (err, data) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }
    return res.json({status: 'success', data: data});
  });
});

// post a new reference image
router.post('/:task_id/upload-image', upload.array('file'), function (req, res) {
  console.log('uploading an image file!');
  Task.findById(req.params.task_id, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (!data) {
      console.log('no task found');
      return res.status(400).json({status: 'failed', message: 'no task found.'});
    }
    for (var i = 0; i < req.files.length; i++) {
      data.ref_images.push(req.files[i]);
    }
    data.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({status: 'success'});
    });
  });
})

router.get('/:task_id', function (req, res) {
  Task.findOne({shoot_id: req.params.shoot_id, _id: req.params.task_id }, function (err, data) {
    if (err) { return res.status(400).send(err); } else {
      return res.json(data);
    }
  })
})

/**
 * Source this task to Crowdflower
 */
router.post('/:task_id/crowdsource', function (req, res) {
  Task.findOne({shoot_id: req.params.shoot_id, _id: req.params.task_id }, function (err, data) {
    if (err) { return res.status(400).send(err);}
    else {
      var units = [{"name":"item 1", "url":"example.com/item1"},{"name":"item 2", "url":"example.com/item2"}];
      var job = new Job({
        title : 'Temp Title',
        instructions : 'Temp Instructions',
        cml : 'Temp CML',
        css : 'Temp CSS',
        js : 'Temp JS',
        support_email : 'g.i.gregory@ncl.ac.uk',
        payment_cents : 1,
        units_per_assignment : 1,
        judgments_per_unit : 1,
        units : units
      });

      crowdflower.createJob(job)
        .then(function (data) {
          console.log(data);
          res.send(data);
        })
        .catch(function (err) {
          console.log(err);
          res.send(err);
        });
    }
  })
});

module.exports = router;
