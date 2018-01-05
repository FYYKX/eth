var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var cron = require('node-cron');
var ticker = require('./routes/ticker');
var balances = require('./routes/balances');

var request = require('request');
var async = require('async');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/balances', balances);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var btc = cron.schedule('*/3 * * * * *', function () {
  ticker.btc(function (results) {
    var low = 0;
    var lowExchange = '';

    var high = 0;
    var highExchange = '';
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
        lowExchange = item.exchange;
      }

      if (item.bid > high) {
        high = item.bid;
        highExchange = item.exchange;
      }
    });

    var percentage = (high - low) / low;
    var date = new Date();
    if (percentage > 0.04) {
      console.log(date + ',' + lowExchange + ',' + low + ',' + highExchange + ',' + high + ',' + percentage);
    } else if (isNaN(percentage)) {
      console.log(date + ',error');
    } else {
      console.log(date + ',' + percentage);
    }
  });
}, false);

var ethereum = cron.schedule('*/3 * * * * *', function () {
  ticker.eth(function (results) {
    var low = 0;
    var lowExchange = '';

    var high = 0;
    var highExchange = '';
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
        lowExchange = item.exchange;
      }

      if (item.bid > high) {
        high = item.bid;
        highExchange = item.exchange;
      }
    });

    var percentage = (high - low) / low;
    var date = new Date();
    if (percentage > 0.02) {
      console.log(date + ',' + lowExchange + ',' + low + ',' + highExchange + ',' + high + ',' + percentage);
    } else if (isNaN(percentage)) {
      // console.log(date + ',error');
    } else {
      // console.log(date + ',' + percentage);
    }
  });
}, false);

module.exports = app;
