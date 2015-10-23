var express = require('express')
  , router = express.Router()
  , restful = require('node-restful')
  , TaskTemplate = require('../models/task-template');

var Resource = router.resource = restful.model('task-template', TaskTemplate.schema)
    .methods(['get', 'post', 'put', 'delete']);

// /* GET users listing. */
// router.get('/:id', function(req, res, next) {
//   var customerId = parseInt(req.params.id);
//   var data = {};
//   for (var i = 0; i < customers.length; i++) {
//     if (customers[i].id === customerId) {
//       data = customers[i];
//       break;
//     }
//   }
//   res.json(data);
// });
//
// router.get('/', function (req, res, next) {
//   res.json(customers);
// });

Resource.register(router, '/');

module.exports = router;
