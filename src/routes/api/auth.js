var express = require('express')
  , router = express.Router({mergeParams: true})
  , params = require('../../config/params.js')
  , requestify = require('requestify');

//get current bootlegger session key
router.get('/session', function (req, res) {
  res.json({session:req.session.sessionkey});
});

//initiate bootlegger auth
router.get('/auth', function (req, res) {
  res.redirect(params.apiurl + '/api/auth/login?apikey='+APIKEY);
});

//return endpoint for bootlegger returning session key
router.get('/success', function (req, res) {
  req.session.sessionkey = req.query.session;
  req.session.save();
  res.redirect('/#/dashboard/home');
  console.log('SUCCESS: ' + req.query.session);
});

// tears down the users session
router.get('/logout', function (req, res) {
  req.session.sessionkey = undefined;
  req.session.save();
  res.json({message: 'logged out successfully.'});
});

//TODO: TEST THIS
//TODO: Need to get session key and pass it along
router.get('/profile', function (req, res) {
  requestify.get(params.apiurl + '/api/profile/me?apikey=' + params.apikey)
    .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
})

module.exports = router;
