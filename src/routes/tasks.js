var express = require('express')
  , router = express.Router()
  , restful = require('node-restful')
  , Task = require('../models/task');

var Resource = router.resource = restful.model('task', Task.schema)
    .methods(['get', 'post', 'put']);

Resource.register(router, '/');

module.exports = router;
