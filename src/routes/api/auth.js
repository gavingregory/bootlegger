var express = require('express');
var router = express.Router();

//get current bootlegger session key
router.get('/session', function (req, res) {
  res.json({session:req.session.sessionkey});
});

//initiate bootlegger auth
router.get('/auth', function (req, res) {
  res.redirect(APIURL + '/api/auth/login?apikey='+APIKEY);
});

//return endpoint for bootlegger returning session key
router.get('/success', function (req, res) {
  req.session.sessionkey = req.query.session;
  req.session.save();
  res.redirect('/');
});

// tears down the users session
router.get('/logout', function (req, res) {
  req.session.sessionkey = undefined;
  req.session.save();
  res.json({message: 'logged out successfully.'});
});

module.exports = router;
