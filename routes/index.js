var express = require('express');
var request = require('request');
var async = require('async');
var apicache = require('apicache');

var ticker = require('./ticker');
var orderbook = require('./orderbook');

var router = express.Router();
var cache = apicache.middleware;

router.get('/', function (req, res, next) {
  res.render("btc");
});

router.get('/btc.json', function (req, res, next) {
  ticker.btc(function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });

    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/eth', function (req, res, next) {
  res.render("eth")
});

router.get('/eth.json', function (req, res, next) {
  ticker.eth(function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });

    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qqb', function (req, res, next) {
  res.render("qqb");
});

router.get('/qq', function (req, res, next) {
  res.render('qq', { qq: 'qq' });
});

router.get('/qe', function (req, res, next) {
  res.render("qe");
});

router.get('/qe.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(51, 31, 'QSHETH', function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qe_qq.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(51, 31, null, function (results) {
    var low = 0;
    var data = results.filter(item => item != null);
    data.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: data
    });
  });
});

router.get('/qb', function (req, res, next) {
  res.render("qb");
});

router.get('/qb.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(52, 32, 'QSHBTC', function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qb_qq.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(52, 32, null, function (results) {
    var low = 0;
    var data = results.filter(item => item != null);
    data.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: data
    });
  });
});

router.get('/qu', function (req, res, next) {
  res.render('qu');
});

router.get('/qu.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(57, null, 'QSHUSD', function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qus.json', cache('10 seconds'), function (req, res, next) {
  async.parallel({
    rates: function (callback) {
      request.get({
        url: "http://api.fixer.io/latest?base=SGD&symbols=USD",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, body);
        } catch (e) {
          return callback(e);
        }
      });
    },
    quoine: function (callback) {
      request.get({
        url: "https://api.quoine.com/products",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, body);
        } catch (e) {
          return callback(e);
        }
      });
    },
    bitfinex: function (callback) {
      request.get({
        url: "https://api.bitfinex.com/v1/pubticker/QSHUSD",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, body);
        } catch (e) {
          return callback(e);
        }
      });
    }
  },
    function (err, results) {
      var data = [];
      var qash_usd = results.quoine.find(item => item.currency_pair_code == 'QASHUSD');
      var qash_sgd = results.quoine.find(item => item.currency_pair_code == 'QASHSGD');
      var sgd_usd = results.rates.rates.USD;

      data.push({
        exchange: "quoine",
        ask: qash_usd.market_ask,
        bid: qash_usd.market_bid
      });
      data.push({
        exchange: "quoine",
        sgd_usd: sgd_usd,
        ask_sgd: qash_sgd.market_ask,
        ask: qash_sgd.market_ask * sgd_usd,
        bid_sgd: qash_sgd.market_bid,
        bid: qash_sgd.market_bid * sgd_usd
      });
      data.push({
        exchange: "bitfinex",
        ask: results.bitfinex.ask,
        bid: results.bitfinex.bid
      });

      var low = 0;
      data.forEach(function (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      });
      res.json({
        ask: low,
        ticker: data
      });
    }
  );
});

router.get('/qqb.json', cache('10 seconds'), function (req, res, next) {
  ticker.qash(function (results) {
    var data = results.map(item => {
      item.quoine = item.exchange != 'quoine' ? (item.bid - results[0].ask) / results[0].ask : '';
      item.qryptos = item.exchange != 'qryptos' ? (item.bid - results[1].ask) / results[1].ask : '';
      item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[2].ask) / results[2].ask : '';
      return item;
    });

    var high = 0;
    var buy = '';
    var sell = '';
    data.forEach(function (item) {
      if (item.quoine > high) {
        high = item.quoine;
        sell = item.exchange;
        buy = 'quoine';
      }
      if (item.qryptos > high) {
        high = item.qryptos;
        sell = item.exchange;
        buy = 'qryptos';
      }
      if (item.bitfinex > high) {
        high = item.bitfinex;
        sell = item.exchange;
        buy = 'bitfinex';
      }
    });

    res.json({
      chance: high,
      buy: buy,
      sell: sell,
      ticker: data
    });
  })
});

router.get('/eb', function (req, res, next) {
  res.render("eb");
});

router.get('/eb.json', cache('10 seconds'), function (req, res, next) {
  orderbook.product(37, 4, 'ETHBTC', function (results) {
    var low = 0;
    results.forEach(function (item) {
      if (low === 0 || item.ask < low) {
        low = item.ask;
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

router.get('/qes', function (req, res, next) {
  res.render("qes");
});

router.get('/qes.json', cache('10 seconds'), function (req, res, next) {
  async.parallel({
    qryptos: function (callback) {
      request.get({
        url: 'https://api.qryptos.com/products/31',
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          callback(null, body);
        }
      });
    },
    quoine: function (callback) {
      request.get({
        url: 'https://api.quoine.com/products',
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var ethqash = body
            .filter(item => ['ETHSGD', 'QASHSGD'].includes(item.currency_pair_code));
          callback(null, ethqash);
        }
      });
    }
  },
    function (err, result) {
      var data = [];

      var qash_eth = result.qryptos.market_bid;

      var eth_sgd = result.quoine[0].market_bid;
      var qash_sgd = result.quoine[1].market_ask;

      var sell = qash_eth * eth_sgd;
      var buy = qash_sgd;

      var percentage = (sell - buy) / buy;

      data.push({
        action: "Buy QASHSGD",
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
        action: "SELL QASHSGD",
        sell: sell,
        qash_eth: "<span class='label label-warning'>" + qash_eth + "</span>",
        eth_sgd: "<span class='label label-primary'>" + eth_sgd + "</span>",
        buy: buy,
        percentage: percentage
      });

      res.json(data);
    });
});

router.get('/bte', function (req, res, next) {
  res.render("bte");
});

router.get('/bte.json', cache('10 seconds'), function (req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products',
    json: true
  }, function (error, response, body) {
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

router.get('/ste', function (req, res, next) {
  res.render("ste");
});

router.get('/ste.json', cache('10 seconds'), function (req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var qash_eth = body.find(item => item.currency_pair_code === 'QASHETH');
      var qash_sgd = body.find(item => item.currency_pair_code === 'QASHSGD');

      var eth_sgd = body.find(item => item.currency_pair_code === 'ETHSGD');

      var data = [];

      var sgd_eth = 1 / eth_sgd.market_ask;
      var sgd_qash_eth = (1 / qash_sgd.market_ask) * qash_eth.market_bid;

      data.push({
        currency: "SGDETH",
        qash: "",
        eth: sgd_eth,
        percentage: 0
      });
      data.push({
        currency: "SGDQASHETH",
        qash: 1 / qash_sgd.market_ask,
        eth: sgd_qash_eth,
        percentage: (sgd_qash_eth - sgd_eth) / sgd_eth
      });
      res.json(data);
    }
  });
});

router.get('/qtb', function (req, res, next) {
  res.render("qtb");
});

router.get('/qtb.json', cache('10 seconds'), function (req, res, next) {
  async.parallel(
    {
      qsheth: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/qsheth',
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      },
      qshbtc: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/qshbtc',
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      },
      ethbtc: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/ethbtc',
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      }
    },
    function (err, result) {
      var data = [];

      var qash_btc = result.qshbtc.bid;
      var qash_eth_btc = result.qsheth.bid * result.ethbtc.ask;

      data.push({
        currency: "QASH",
        eth: "",
        btc: qash_btc,
        percentage: 0
      });
      data.push({
        currency: "QASH",
        eth: result.qsheth.bid,
        btc: qash_eth_btc,
        percentage: (qash_eth_btc - qash_btc) / qash_btc
      });
      res.json(data);
    }
  );
});

router.get('/cycle', function (req, res, next) {
  res.render("cycle");
});

router.get("/spread", function (req, res, next) {
  res.render("spread");
});

router.get("/spread.json", function (req, res, next) {
  async.parallel({
    coinmarketcap: function (callback) {
      request.get({
        url: 'https://api.coinmarketcap.com/v1/ticker/?convert=ETH',
        json: true
      }, function (error, response, body) {
        callback(null, body);
      })
    },
    quoine: function (callback) {
      request.get({
        url: 'https://api.' + req.query.exchange + '.com/products',
        json: true
      }, function (error, response, body) {
        var data = body
          .filter(item => item.market_ask > 0)
          .filter(item => item.volume_24h > 100);
        callback(null, data);
      });
    }
  }, function (err, results) {
    var data = results.quoine
      .map(item => {
        item.percentage = (item.market_ask - item.market_bid) / item.market_bid;
        item.change_24h = (item.market_bid - item.last_price_24h) / item.last_price_24h
        item.coinmarketcap = results.coinmarketcap.find(c => c.symbol == item.base_currency);
        return item;
      })
      .filter(item => item.percentage > 0.1);

    res.json(data);
  });
});

router.get('/poloniex.json', function (req, res) {
  request.get({
    url: 'https://poloniex.com/public?command=returnTicker',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var btc_str = body.BTC_STR;
      var usdt_str = body.USDT_STR;
      var usdt_eth = body.USDT_ETH;
      var btc_xem = body.BTC_XEM;
      var btc_etc = body.BTC_ETC;
      var btc_xrp = body.BTC_XRP;

      var data = [];
      data.push({
        currency: "XLMBTC",
        price: btc_str.last,
        change: btc_str.percentChange
      });
      data.push({
        currency: "XLMETH",
        price: usdt_str.last / usdt_eth.last,
        change: usdt_str.percentChange
      });
      data.push({
        currency: "XEMBTC",
        price: btc_xem.last,
        change: btc_xem.percentChange
      });
      data.push({
        currency: "ETCBTC",
        price: btc_etc.last,
        change: btc_etc.percentChange
      });
      data.push({
        currency: "XRPBTC",
        price: btc_xrp.last,
        change: btc_xrp.percentChange
      });

      res.json(data);
    }
  });

});

router.get("/order", function (req, res, next) {
  res.render("order");
});

router.get("/order.json", function (req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products/' + req.query.id + '/price_levels?full=1',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var sell_low = body.sell_price_levels[0][0];
      var sell = body.sell_price_levels.map(item => {
        return {
          side: "<span class='label label-danger'>sell</span>",
          price: item[0],
          amount: item[1],
          percentage: item[0] / sell_low
        }
      });

      var buy_high = body.buy_price_levels[0][0];
      var buy = body.buy_price_levels.map(item => {
        return {
          side: "<span class='label label-success'>buy</span>",
          price: item[0],
          amount: item[1],
          percentage: item[0] / buy_high
        }
      });

      var data = sell.concat(buy);
      res.json(data);
    }
  });
});

module.exports = router;
