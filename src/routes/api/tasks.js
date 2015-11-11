var express = require('express')
  , multer = require('multer')
  , mime = require('mime')
  , router = express.Router({mergeParams: true})
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
  t.save(function (err) {
    if (err) return res.status(400).send(err);
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
