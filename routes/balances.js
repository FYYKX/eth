
var express = require('express');
var async = require('async');

var config = require('../config');
var qqclient = require('./exchange/quoine');
var bitfinex = require('./exchange/bitfinex');
var poloniex = require('./exchange/poloniex');

var router = express.Router();

router.get('/:exchange', function (req, res) {
  var exchange = req.params.exchange;
  var qq = 'quoine';
  if (exchange == 'qryptos') {
    exchange = 'quoine';
    qq = 'qryptos';
  }

  var client = require('./exchange/' + exchange);
  if (exchange == 'quoine') {
    client = new client(config[qq]);
  }
  client.balances(function (body) {
    res.json(body);
  });
});

router.get('/', function (req, res) {
  async.parallel([
    function (callback) {
      var quoine = new qqclient(config.quoine);
      quoine.balances(function (body) {
        callback(null, {
          exchange: "quoine",
          btc: body.find(item => item.currency == 'BTC').balance,
          eth: body.find(item => item.currency == 'ETH').balance,
          qash: body.find(item => item.currency == 'QASH').balance,
          usd: body.find(item => item.currency == 'USD').balance
        });
      });
    },
    function (callback) {
      var qryptos = new qqclient(config.qryptos);
      qryptos.balances(function (body) {
        callback(null, {
          exchange: "qryptos",
          btc: body.find(item => item.currency == 'BTC').balance,
          eth: body.find(item => item.currency == 'ETH').balance,
          qash: body.find(item => item.currency == 'QASH').balance,
          usd: 0
        });
      });
    },
    function (callback) {
      bitfinex.balances(function (body) {
        body = body.filter(item => item.type == 'exchange');
        callback(null, {
          exchange: "bitfinex",
          btc: body.find(item => item.currency == 'btc').available,
          eth: body.find(item => item.currency == 'eth').available,
          qash: body.find(item => item.currency == 'qsh').available,
          usd: body.find(item => item.currency == 'usd').available
        });
      });
    },
    function (callback) {
      poloniex.balances(function (body) {
        callback(null, {
          exchange: "poloniex",
          btc: body.BTC,
          eth: body.ETH,
          qash: 0,
          usd: body.USDT
        });
      });
    }
  ],
    function (err, results) {
      if (err) {
        res.json({});
      } else {
        res.json(results);
      }
    });
});

module.exports = router;