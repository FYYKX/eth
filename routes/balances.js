
var express = require('express');
var async = require('async');
var apicache = require('apicache');

var liquid = require('./exchange/liquid');
var bitfinex = require('./exchange/bitfinex');
var poloniex = require('./exchange/poloniex');

var router = express.Router();
var cache = apicache.middleware;

router.get('/:exchange', function (req, res) {
  var exchange = req.params.exchange;
  var client = require('./exchange/' + exchange);
  client.balances(function (body) {
    res.json(body);
  });
});

router.get('/', cache('30 seconds'), function (req, res) {
  async.parallel([
    function (callback) {
      liquid.balances(function (body) {
        try {
          var data = {
            exchange: "liquid",
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
