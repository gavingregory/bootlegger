var express = require('express'),
  multer = require('multer'),
  bootlegger = require('../../services/bootlegger/bootlegger'),
  mime = require('mime'),
  params = require('../../config/params'),
  router = express.Router({
    mergeParams: true
  }),
  moment = require('moment'),
  videoHelper = require('../../services/videoHelper'),
  Task = require('../../models/task').model,
  crowdflower = require('../../services/crowdflower/Crowdflower')(params.cf_api),
  qs = require('querystring'),
  Job = require('../../services/crowdflower/Job');

// multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/files')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
  }
});
var upload = multer({
  storage: storage
});

// get task
router.get('/', function(req, res) {
  Task.find({ shoot_id: req.params.shoot_id }, function(err, data) {
    if (err) return res.send(err);
    return res.send(data);
  });
});

// post a new task
router.post('/', function(req, res) {
  var type = req.body.type; // 'validation' or 'addition'
  var t = new Task(req.body);
  var videos = {};
  // GET SHOOT FROM BOOTLEGGER
  bootlegger.getShoot(req.session.sessionkey, req.params.shoot_id)
    .then(function(data) {

      console.log('Retrieved video data from Bootlegger');

      // obtained videos from bootlegger API
      videos = JSON.parse(data.body);

      // create array of promises. these are for each access to the
      // bootlegger API to resolve the secure URL of the video file
      var promises = [];

      // ITERATE OVER ALL VIDEOS, OBTAIN 'SECURE URL' FOR EACH VIDEO
      var i = 0;
      var running_promises = 0;
      videos.forEach(function (v) {
        // create a new promise
        var p = bootlegger.getSecureVideoUrl(req.session.sessionkey, v.id)
          .then(function(response) {
            console.log('We did not get a successful response from bootlegger' + JSON.stringify(response));
          })
          .catch(function(response) {
            if (response.code === 302) {
              console.log('successful response');
              v.path = qs.escape(response.headers.location);
            } else
              console.log('We did not get a successful response from bootlegger: ' + JSON.stringify(response) + '\nfor url: ' + v.id);
          });

        // add promise to array
        promises.push(p);
      });

      // FETCH TEMPLATES FROM BOOTLEGGER
      var templates = {};
      var fetchTemplate = bootlegger.getTemplates(req.session.sessionkey)
        .then(function(data) { templates = JSON.parse(data.body); })
        .catch(function(err) { res.status(err.code).send(err); });

      // also add templates to the promises array
      promises.push(fetchTemplate);

      Promise.all(promises).then(function(values) {
        
        // ALL PROMISES RESOLVED, CONTINUE WITH CROWDFLOWER UPLOAD
        console.log('All promises resolved.');

        // GENERATE SEGMENTS
        var id = 0; // id for each job
        for (var i = 0; i < videos.length; i++) {
          videoHelper.distributeVideoIndexes(videos[i].meta.static_meta.clip_length, req.body.segment_size, function(result) {

            for (j = 0; j < result.segments.length; j++) {
              var path = videos[i].path;
              var o = {
                id: id++,
                video: {
                  index: i,
                  start: result.segments[j].start,
                  end: result.segments[j].end,
                  bootlegger_id: videos[i].id,
                  filename: videos[i].meta.static_meta.local_filename,
                  path: path,
                  length: videoHelper.durationToMillis(videos[i].meta.static_meta.clip_length),
                  filesize: videos[i].meta.static_meta.filesize,
                  template_id: videos[i].meta.shot_ex.id,
                  template_url: videos[i].meta.shot_ex.image,
                  template_desc: videos[i].meta.shot_ex.description
                }
              };
              t.jobs.push(o);
            }
          });
        }
        t.save(function(err, data) {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          // CREATE CROWDFLOWER 'ROWS/UNITS' FOR EACH JOB IN DATABASE, WHICH NEED TO BE 1-DIMENSIONAL OBJECTS
          var units = [];
          for (var i = 0; i < data.jobs.length; i++) {

            var row = {
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
            };

            // IF THIS IS VALIDATION TASK, WE NEED TO PERFORM ADDITIONAL STEPS
            if (type === 'validation') {

              // WE NEED TO POPULATE EACH ROW WITH 4 TEMPLATES - 1 CORRECT, 3 RANDOM
              var template_count = 1; // start at 1, as the first one is always the ACTUAL template
              var rng = Math.floor(Math.random() * 4); // rng between 0 ~ 3
              var template_index = 0;
              
              // find the index in the array of TEMPLATES for the actual selected template
              for (var template_index = 0; template_index < templates.length; template_index++)
                if (templates[template_index].image === data.jobs[i].video.template_url) { break; console.log('found index!'); }// found the index hopefully
              
                // the actual template
              row['template_' + rng + '_id'] = data.jobs[i].video.template_id;
              row['template_' + rng + '_img'] = data.jobs[i].video.template_url;
              row['template_' + rng + '_desc'] = data.jobs[i].video.template_desc;
              row['template_' + rng + '_selected'] = true;
              rng = (rng + 1) % 4; // increment and overflow the rng
              template_index = (template_index + 1) % templates.length; // increment and overflow the template index

              while (template_count < 4) {
                row['template_' + rng + '_id'] = templates[template_index].id;
                row['template_' + rng + '_img'] = templates[template_index].image;
                row['template_' + rng + '_desc'] = templates[template_index].description;
                row['template_' + rng + '_selected'] = false;
                template_count++; // we have assigned one more template
                rng = (rng + 1) % 4; // increment and overflow the rng
                template_index = (template_index + 1) % templates.length; // increment and overflow the template index
              }
            }

            units.push(row);
          }

          // then upload to CF
          var job = new Job({
            title: data.name,
            instructions: data.instructions,
            cml: data.cml,
            css: data.css,
            js: data.js,
            support_email: data.support_email,
            payment_cents: data.cent_per_job,
            units_per_assignment: 1,
            judgments_per_unit: 1,
            units: units
          });

          crowdflower.createJob(job)
            .then(function(cf_data) {
              var parsed = JSON.parse(cf_data.body);
              t.cf_job_id = parsed.id;
              t.save(function(err, data) {
                if (err) return res.status(400).send(err);
                res.json({
                  status: 'success',
                  data: data
                });
              });
            })
            .catch(function(err) {
              res.json({
                status: 'failed',
                data: err
              });
            });
        });

      }, function(err) {
        console.log(err);
        return res.send('err');
      });

    })
    .catch(function(err) {
      res.status(err.code).send(err);
    });
});

// post a new reference image
router.post('/:task_id/upload-image', upload.array('file'), function(req, res) {
  console.log('uploading an image file!');
  Task.findById(req.params.task_id, function(err, data) {
    if (err) {
      console.log('Unable to find the task?');
      console.log(err);
      return res.status(500).send(err);
    }
    if (!data) {
      console.log('no task found');
      return res.status(400).json({
        status: 'failed',
        message: 'no task found.'
      });
    }
    for (var i = 0; i < req.files.length; i++) {
      data.ref_images.push(req.files[i]);
    }
    data.save(function(err) {
      if (err) {
        console.log('Found the task when uploading image, but unable to save back to database ...');
        console.log(err);
        return res.status(500).send(err);
      }
      return res.json({
        status: 'success'
      });
    });
  });
})

// get results
router.get('/:task_id/results/:page', function (req, res) {
  crowdflower.getResults(req.params.task_id, req.params.page)
    .then(function (data) {
      return res.send(JSON.parse(data.body));
    })
    .catch(function (err) {
      console.log(err);
      return res.status(400).send(err);
    });
});

// get a single task
router.get('/:task_id', function(req, res) {
  Task.findOne({
    shoot_id: req.params.shoot_id,
    _id: req.params.task_id
  }, function(err, data) {
    if (err) return res.status(400).send(err);
    crowdflower.getJob(data.cf_job_id)
      .then(function(cf_data) {
        var r = {};
        r.data = data;
        r.cf = JSON.parse(cf_data.body);
        return res.json(r);
      })
      .catch(function(err) {
        console.log('catch err')
        return res.status(400).send(err);
      });
  })
});

// delete a task
router.delete('/:task_id', function (req, res) {
  //FBFriendModel.find({ id:333 }).remove( callback );
  Task.find({_id : req.params.task_id }, function (err, task) {
    if (err) return res.status(400).send(err);
    crowdflower.deleteJob(task[0].cf_job_id)
      .then(function (response) {
        Task.remove({_id: task._id }, function (err) {
          if (err) return res.status(400).send(err);
          return res.json({status: 'success'});
        });
      }).catch (function (err) {
        console.log(err);
        return res.status(400).send(err);
      });
  });
});

module.exports = router;