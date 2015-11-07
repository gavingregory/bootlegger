var express = require('express')
  , router = express.Router()
  , authRoute = require('./api/auth')
  , restful = require('node-restful')
  , TaskTemplate = require('../models/task-template')
  , Task = require('../models/task');

  // Task Templates
  var TemplateResource = router.resource = restful.model('tasktemplate', TaskTemplate.schema)
      .methods(['get', 'post', 'put']);
  TemplateResource.register(router, '/task-templates');

  // Tasks
  var TaskResource = router.resource = restful.model('task', Task.schema)
      .methods(['get', 'post', 'put']);
  TaskResource.register(router, '/tasks');

  // Authentication
  router.use('/auth', authRoute);

  // Export
  module.exports = router;
