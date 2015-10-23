var express = require('express')
  , router = express.Router()
  , restful = require('node-restful')
  , Task = require('../models/task');

var Resource = router.resource = restful.model('task', Task.schema)
    .methods(['get', 'post', 'put', 'delete']);

var customers = [
  {
    id: 1,
    name: 'Gavin Gregory',
    address: '353 Manchester Road, Blackrod, Bolton, BL6 5BH',
    orderTotal: 3.99,
    orders: [
      {
        id: 1,
        product: 'Muffins',
        total: 3.99
      }
    ],
    joined: new Date()
  },{
    id: 2,
    name: 'Bouvier Servillas',
    address: '2201 Florence Lane, Bensalem, PA, 19020',
    orderTotal: 6.98,
    orders: [
      {
        id: 2,
        product: 'Balsamic Vinegar',
        total: 2.99
      },{
        id: 3,
        product: 'Lemons',
        total: 3.99
      }
    ],
    joined: new Date()
  },{
    id: 3,
    name: 'Geoff Whitehead',
    address: 'Morpeth, Northumberland, NE61 1DS',
    orderTotal: 23.99,
    orders: [
      {
      id: 4,
      product: 'Key fob',
      total: 23.99
      }
    ],
    joined: new Date()
  }
];

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
