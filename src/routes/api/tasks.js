var express = require('express')
  , multer = require('multer')
  , router = express.Router({mergeParams: true})
  , Task = require('../../models/task').model;

// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage:storage});

// get all tasks
router.get('/', function (req, res) {
  console.log(req.params.shoot_id);
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
    if (err) return res.send(err);
    return res.json({status: 'success'});
  });
});

module.exports = router;
