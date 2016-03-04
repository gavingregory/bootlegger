var express = require('express')
  , LEX = require('letsencrypt-express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , settings = require('./src/config/params')
  , db = require('./src/config/db')
  , bodyParser = require('body-parser')
  , mongoose = require('mongoose')
  , session = require('express-session')
  , swig = require('swig')
  , indexRoute = require('./src/routes/index')
  , apiRoute = require('./src/routes/api')
  , crowdRoute = require('./src/routes/crowd/crowd')
  , seed = require('./src/config/seed')
  , app = express();

// database
mongoose.connect(db.url, function (err) {
  if (err) {console.log(err);}
  else {console.log('Successfully connected to the mongo database');}
});

app.use(session({
  secret: 'lkashdklajsdklajsdkljaskldjaklsdjaklsjd'
}));

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+ '/views');
swig.setDefaults({ cache: false });
app.set('view cache', false); // enable in production!

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoute);
// app.get('/dbseed', function (req, res) {
//     seed.seed();
//     return res.send('successful');
// });
app.use('/crowd', crowdRoute);
app.use('/api/v1', apiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var lex = LEX.create({
  configDir: require('os').homedir() + '/.letsencrypt',
  approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration
    // Note: this is the place to check your database to get the user associated with this domain
    cb(null, {
      domains: ['crowd.bootegger.tv']
    , email: 'g.i.gregory@ncl.ac.uk' // user@example.com
    , agreeTos: true
    });
  }
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
  var protocol = ('requestCert' in this) ? 'https': 'http';
  console.log("Listening at " + protocol + '://localhost:' + this.address().port);
});

// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('Bootlegger app listening at http://%s:%s', host, port);
// });
