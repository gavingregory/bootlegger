var express = require('express')
  , router = express.Router({mergeParams: true})
  , Task = require('../../models/task').model
  , path = require('path')
  , params = require('../../config/params.js');

//get current bootlegger session key
router.get('/image/:taskid/:i?', function (req, res) {
  if (req.params.i === undefined) req.params.i = 0;
  Task.findById(req.params.taskid, function (err, data) {
    if (err) return res.status(404).send('404 task not found.');
    if (req.params.i >= data.ref_images.length) return res.status(404).send('404 image index not found.');
    console.log(data.ref_images[req.params.i].path);
    return res.sendFile(data.ref_images[req.params.i].path, { root: path.join(__dirname, '../../../') });
  });
});

module.exports = router;
