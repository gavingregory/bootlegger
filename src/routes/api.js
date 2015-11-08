var express = require('express')
  , router = express.Router({mergeParams: true})
  , authRoute = require('./api/auth')
  , tasksRoute = require('./api/tasks')
  , restful = require('node-restful')
  , TaskTemplate = require('../models/task-template')
  , Task = require('../models/task')
  , multiparty = require('connect-multiparty') // required for file upload
  , multipartyMiddleware = multiparty();

  // Task Templates
  var TemplateResource = router.resource = restful.model('tasktemplate', TaskTemplate.schema)
      .methods(['get', 'post', 'put']);
  TemplateResource.register(router, '/task-templates');

  // // Tasks
  // var TaskResource = router.resource = restful.model('task', Task.schema)
  //     .methods(['get', 'post', 'put']);
  // TaskResource.register(router, '/tasks');
  router.use('/shoots/:shoot_id/tasks', tasksRoute);

  // Authentication
  router.use('/auth', authRoute);

  // Export
  module.exports = router;
