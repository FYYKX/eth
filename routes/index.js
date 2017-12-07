var express = require('express');
var request = require('request');
var async = require('async');
var ticker = require('./ticker');
var orderbook = require('./orderbook');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render("btc");
});

router.get('/btc.json', function(req, res, next) {
  ticker.btc(function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });

    res.json({
      ask: low,
      ticker: results.filter(item => item != null)
    });
  });
});

router.get('/eth', function(req, res, next) {
  res.render("eth")
});

router.get('/eth.json', function(req, res, next) {
  ticker.eth(function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });

    res.json({
      ask: low,
      ticker: results.filter(item => item != null)
    });
  });
});

router.get('/qe', function(req, res, next) {
  res.render("qe");
});

router.get('/qe.json', function(req, res, next) {
  orderbook.product(51, 31, 'QSHETH', function(results) {
    var low = 0;
    results
      .forEach(function(item) {
        if (item) {
          if (low === 0 || item.ask < low) {
            low = item.ask;
          }
        }
      });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/eb', function(req, res, next) {
  res.render("eb");
});

router.get('/eb.json', function(req, res, next) {
  orderbook.product(37, 4, 'ETHBTC', function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qb', function(req, res, next) {
  res.render("qb");
});

router.get('/qb.json', function(req, res, next) {
  orderbook.product(52, 32, 'QSHBTC', function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qu', function(req, res, next) {
  res.render("qu");
});

router.get('/qu.json', function(req, res, next) {
  orderbook.product(57, null, 'QSHUSD', function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });
    res.json({
      ask: low,
      ticker: results.filter(item => item != null)
    });
  });
});

router.get('/qes', function(req, res, next) {
  res.render("qes");
});

router.get('/qes.json', function(req, res, next) {
  async.parallel({
      qryptos: function(callback) {
        request.get({
          url: 'https://api.qryptos.com/products/31',
          json: true
        }, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      },
      quoine: function(callback) {
        request.get({
          url: 'https://api.quoine.com/products',
          json: true
        }, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var ethqash = body
              .filter(item => ['ETHSGD', 'QASHSGD'].includes(item.currency_pair_code));
            callback(null, ethqash);
          }
        });
      }
    },
    function(err, result) {
      var data = [];

      var qash_eth = result.qryptos.market_bid;

      var eth_sgd = result.quoine[0].market_bid;
      var qash_sgd = result.quoine[1].market_ask;

      var sell = qash_eth * eth_sgd;
      var buy = qash_sgd;

      var percentage = (sell - buy) / buy;

      data.push({
        action: "<span class='label label-primary'>Buy QASHSGD</span>",
        sell: sell,
        qash_eth: "<span class='label label-warning'>" + qash_eth + "</span>",
        eth_sgd: "<span class='label label-primary'>" + eth_sgd + "</span>",
        buy: buy,
        percentage: percentage
      });

      qash_eth = result.qryptos.market_ask;

      eth_sgd = result.quoine[0].market_ask;
      qash_sgd = result.quoine[1].market_bid;

      sell = qash_sgd;
      buy = qash_eth * eth_sgd;

      percentage = (sell - buy) / buy;

      data.push({
        action: "<span class='label label-primary'>SELL QASHSGD</span>",
        sell: sell,
        qash_eth: "<span class='label label-warning'>" + qash_eth + "</span>",
        eth_sgd: "<span class='label label-primary'>" + eth_sgd + "</span>",
        buy: buy,
        percentage: percentage
      });

      res.json(data);
    });
});

module.exports = router;
