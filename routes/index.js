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
      ticker: results.filter(item => item != null)
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

router.get('/be', function(req, res, next) {
  res.render("be");
});

router.get('/be.json', function(req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products',
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var btc_sgd = body.find(item => item.currency_pair_code === 'BTCSGD');
      var btc_usd = body.find(item => item.currency_pair_code === 'BTCUSD');

      var eth_btc = body.find(item => item.currency_pair_code === 'ETHBTC');
      var eth_usd = body.find(item => item.currency_pair_code === 'ETHUSD');
      var eth_sgd = body.find(item => item.currency_pair_code === 'ETHSGD');

      var data = [];

      var btc_eth = 1 / eth_btc.market_ask;
      var btc_usd_eth = btc_usd.market_bid / eth_usd.market_ask;
      var btc_sgd_eth = btc_sgd.market_bid / eth_sgd.market_ask;

      data.push({
        currency: "BTCETH",
        usd: "",
        sgd: "",
        eth: btc_eth,
        percentage: 0
      });
      data.push({
        currency: "BTCUSD",
        usd: btc_usd.market_bid,
        sgd: "",
        eth: btc_usd_eth,
        percentage: (btc_usd_eth - btc_eth) / btc_eth
      });
      data.push({
        currency: "BTCSGD",
        usd: "",
        sgd: btc_sgd.market_bid,
        eth: btc_sgd_eth,
        percentage: (btc_sgd_eth - btc_eth) / btc_eth
      });
      res.json(data);
    }
  });
});

module.exports = router;
