var express = require('express')
  , router = express.Router({mergeParams: true})
  , Task = require('../../models/task').model;

// get all tasks
router.get('/', function (req, res) {
  console.log(req.params.shoot_id);
  Task.find({shoot_id: req.params.shoot_id}, function (err, data) {
    if (err) { return res.send(err); }
    return res.send(data);
  });
});

module.exports = router;
