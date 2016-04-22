var express = require('express')
  , router = express.Router({mergeParams: true})
  , params = require('../../config/params.js')
  , bootlegger = require('../../services/bootlegger/bootlegger');

//get current bootlegger session key
router.get('/session', function (req, res) {
  res.json({session:req.session.sessionkey});
});

//initiate bootlegger auth
router.get('/auth', function (req, res) {
  res.redirect(params.bootlegger_api_url + '/api/auth/login?apikey=' + params.bootlegger_api_key);
});

//return endpoint for bootlegger returning session key
router.get('/success', function (req, res) {
  req.session.sessionkey = req.query.session;
  req.session.save();
  res.redirect('/#/dashboard/home');
});

// tears down the users session
router.get('/logout', function (req, res) {
  req.session.sessionkey = undefined;
  req.session.save();
  res.json({message: 'logged out successfully.'});
});

// returns the bootlegger user profile
router.get('/profile', function (req, res) {
  bootlegger.getProfile(req.session.sessionkey)
    .then(function (data) { res.json(data.body); })
    .catch(function (err) { res.status(400).send(err); });
})

module.exports = router;
