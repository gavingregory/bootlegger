var express = require('express')
  , router = express.Router({mergeParams: true})
  , authRoute = require('./api/auth')
  , tasksRoute = require('./api/tasks')
  , shootRoute = require('./api/shoots')
  , restful = require('node-restful')
  , TaskTemplate = require('../models/task-template')
  , Task = require('../models/task')
  , multiparty = require('connect-multiparty') // required for file upload
  , multipartyMiddleware = multiparty();

// Authentication
router.use('/auth', authRoute);

//router.use(function (req, res, next) {
//  if (req.session.sessionkey === undefined) return res.status(401).json({error: 'invalid session.'});
//  next();
//});

// Task Templates
var TemplateResource = router.resource = restful.model('tasktemplate', TaskTemplate.schema)
  .methods(['get', 'post', 'put']);
TemplateResource.register(router, '/task-templates');

// Tasks
router.use('/shoots/:shoot_id/tasks', tasksRoute);

// Shoots
router.use('/shoots', shootRoute);

// Export
module.exports = router;
