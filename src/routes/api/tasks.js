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

// get task
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

  // create array of promises. these are for each access to the
  // bootlegger API to resolve the secure URL of the video file
  var promises = [];

  // we need to iterate over all the videos and update their URL's to the secure URL's
  for (var i = 0; i < videos.length; i++) {

    // create a new promise
    var p = new Promise(function (resolve, reject) {
      // id of the current video
      var id = videos[i].id;
      // prep URL for bootlegger
      var url = params.bootlegger_media_url(videos[i].id);
      // send http request to bootlegger api
      requestify.head(url, { cookies: {'sails.sid' : req.session.sessionkey} })
        .then(function (response) {
          reject('We did not get a successful response from bootlegger' + JSON.stringify(response));
        })
        .catch(function (response) {
          if (response.code === 302) {
            resolve({ id: id, location: response.headers.location});
          } else {
            reject('We did not get a successful response from bootlegger: ' + JSON.stringify(response)
              + '\nfor url: ' + url);
          }
        });
    });

    // resolve the promise
    p.then(function (value) {
      // update the path in the video array
      for (var j = 0; j < videos.length; j++) {
        if (videos[j].id === value.id) {
          console.log('UPDATING: ' + value.location);
          videos[j].path = value.location;
          break;
        }
      }
    });

    // add promise to array
    promises.push(p);
  }

  Promise.all(promises).then(function (values) {
    // all promises have been resolved .... continue ...!
    console.log('all promises resolved.');

    // continue ...........


    // iterate over videos
    var id = 0; // id for each job
    for (var i = 0; i < videos.length; i++) {
      videoHelper.distributeVideoIndexes(videos[i].meta.static_meta.clip_length, req.body.segment_size, function (result) {

        for (j = 0; j < result.segments.length; j++) {
          var path = videos[i].path;
          console.log('generating secure url: ' + path);
          var o = {
            id: id++,
            video: {
              index : i,
              start : result.segments[j].start,
              end: result.segments[j].end,
              bootlegger_id: videos[i].id,
              filename: videos[i].meta.static_meta.local_filename,
              path: path,
              length: videoHelper.durationToMillis(videos[i].meta.static_meta.clip_length),
              filesize: videos[i].meta.static_meta.filesize
            }
          };
          t.jobs.push(o);
        }
      });
    }
    t.save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      // create units of data for each CF job
      var units = [];
      for (var i = 0; i < data.jobs.length; i++) {
        units.push({
          id: data.jobs[i].id,
          video_index: data.jobs[i].video.index,
          video_start: data.jobs[i].video.start,
          video_end: data.jobs[i].video.end,
          video_filename: data.jobs[i].video.filename,
          video_path: data.jobs[i].video.path,
          bootlegger_id: data.jobs[i].video.bootlegger_id,
          video_length: data.jobs[i].video.length,
          video_filesize: data.jobs[i].video.filesize,
          task_id: data._id,
          ref_image: 0
        });
      }

      // else, upload to CF
      var job = new Job({
        title : data.name,
        instructions : data.instructions,
        cml : data.cml,
        css : data.css,
        js : data.js,
        support_email : data.support_email,
        payment_cents : data.cent_per_job,
        units_per_assignment : 1,
        judgments_per_unit : 1,
        units : units
      });

      crowdflower.createJob(job)
        .then(function (cf_data) {
          var parsed = JSON.parse(cf_data.body);
          t.cf_job_id = parsed.id;
          t.save(function (err, data) {
            if (err) return res.status(400).send(err);
            res.json({status: 'success', data: data});
          });
        })
        .catch(function (err) {
          res.json({status: 'failed', data: err});
        });
    });

  }, function (err) {
    console.log(err);
    return res.send('err');
  });
});

// post a new reference image
router.post('/:task_id/upload-image', upload.array('file'), function (req, res) {
  console.log('uploading an image file!');
  Task.findById(req.params.task_id, function (err, data) {
    if (err) {
      console.log('Unable to find the task?');
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
        console.log('Found the task when uploading image, but unable to save back to database ...');
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({status: 'success'});
    });
  });
})

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
