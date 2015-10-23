var express = require('express')
  , router = express.Router()
  , restful = require('node-restful')
  , TaskTemplate = require('../models/task-template');

var Resource = router.resource = restful.model('task-template', TaskTemplate.schema)
    .methods(['get', 'post', 'put', 'delete']);

Resource.register(router, '/');

module.exports = router;
