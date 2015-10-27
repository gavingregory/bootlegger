var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/success', function(req, res, next) {
  req.session
});

  app.get('/quicklogin', function (req, res) {
        req.session.sessionkey = qs.stringify({'sails.sid':'s:Qc_5zQhBj5n4vnRs6FxvYHmr.sktmMVFCyHv9LBXOs4Qu32VBeY5lmbB6Y2Oi0+NGGTw'});
        req.session.save();
        res.redirect('/');
  });

module.exports = router;
