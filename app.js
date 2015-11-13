var express = require('express')
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
app.set('view cache', false); // enable in production!

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoute);
app.get('/dbseed', function (req, res) {
    seed.seed();
    return res.send('successful');
});
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

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Bootlegger app listening at http://%s:%s', host, port);
});
