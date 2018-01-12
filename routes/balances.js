
var express = require('express');
var async = require('async');
var apicache = require('apicache');

var config = require('../config');
var qqclient = require('./exchange/quoine');
var bitfinex = require('./exchange/bitfinex');
var poloniex = require('./exchange/poloniex');

var router = express.Router();
var cache = apicache.middleware;

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

router.get('/', cache('30 seconds'), function (req, res) {
  async.parallel([
    function (callback) {
      var quoine = new qqclient(config.quoine);
      quoine.balances(function (body) {
        try {
          var data = {
            exchange: "quoine",
            btc: body.find(item => item.currency == 'BTC').balance,
            eth: body.find(item => item.currency == 'ETH').balance,
            qash: body.find(item => item.currency == 'QASH').balance,
            usd: body.find(item => item.currency == 'USD').balance
          };
          callback(null, data);
        } catch (e) {
          callback(null, null);
        }
      });
    },
    function (callback) {
      var qryptos = new qqclient(config.qryptos);
      qryptos.balances(function (body) {
        try {
          var data = {
            exchange: "qryptos",
            btc: body.find(item => item.currency == 'BTC').balance,
            eth: body.find(item => item.currency == 'ETH').balance,
            qash: body.find(item => item.currency == 'QASH').balance,
            usd: 0
          };
          callback(null, data);
        } catch (e) {
          callback(null, null);
        }
      });
    },
    function (callback) {
      bitfinex.balances(function (body) {
        try {
          body = body.filter(item => item.type == 'exchange');
          var data = {
            exchange: "bitfinex",
            btc: body.find(item => item.currency == 'btc').available,
            eth: body.find(item => item.currency == 'eth').available,
            qash: body.find(item => item.currency == 'qsh').available,
            usd: body.find(item => item.currency == 'usd').available
          };
          callback(null, data);
        } catch (e) {
          callback(null, null);
        }
      });
    },
    function (callback) {
      poloniex.balances(function (body) {
        if (body.BTC) {
          callback(null, {
            exchange: "poloniex",
            btc: body.BTC,
            eth: body.ETH,
            qash: 0,
            usd: body.USDT
          });
        } else {
          console.log(body);
          callback(null, null);
        }
      });
    }
  ],
    function (err, results) {
      res.json(results.filter(item => item != null));
    });
});

module.exports = router;