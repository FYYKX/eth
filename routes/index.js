var express = require('express');
var request = require('request');
var async = require('async');
var apicache = require('apicache');

var ticker = require('./ticker');
var orderbook = require('./orderbook');
var config = require('../config');

var qq = require('./exchange/quoine');
var bitfinex = require('./exchange/bitfinex');

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
  ticker.ethusd(function (results) {
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

router.get('/qb.json', cache('20 seconds'), function (req, res, next) {
  ticker.qash(52, 32, 'QSHBTC', function (results) {
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

router.get('/qu.json', cache('20 seconds'), function (req, res, next) {
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
        ask: results.bitfinex.ask ? results.bitfinex.ask : 0,
        bid: results.bitfinex.bid ? results.bitfinex.bid : 0
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

router.get('/qqb.json/:currency?', cache('10 seconds'), function (req, res, next) {
  var quoine = 51;
  var qryptos = 31;
  var bitfinex = 'QSHETH';
  if (req.query.currency == 'BTC') {
    quoine = 52;
    qryptos = 32;
    bitfinex = 'QSHBTC';
  }

  ticker.qash(quoine, qryptos, bitfinex, function (results) {
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
  });
});

router.get('/eb.json', cache('20 seconds'), function (req, res, next) {
  ticker.ethbtc(function (results) {
    var data = results.map(item => {
      item.quoine = item.exchange != 'quoine' ? (item.bid - results[0].ask) / results[0].ask : '';
      item.qryptos = item.exchange != 'qryptos' ? (item.bid - results[1].ask) / results[1].ask : '';
      item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[2].ask) / results[2].ask : '';
      item.poloniex = item.exchange != 'poloniex' ? (item.bid - results[3].ask) / results[3].ask : '';
      item.binance = item.exchange != 'binance' ? (item.bid - results[4].ask) / results[4].ask : '';
      item.hitbtc = item.exchange != 'hitbtc' ? (item.bid - results[5].ask) / results[5].ask : '';
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
      if (item.poloniex > high) {
        high = item.poloniex;
        sell = item.exchange;
        buy = 'poloniex';
      }
      if (item.binance > high) {
        high = item.binance;
        sell = item.exchange;
        buy = 'binance';
      }
      if (item.hitbtc > high) {
        high = item.hitbtc;
        sell = item.exchange;
        buy = 'hitbtc';
      }
    });

    res.json({
      chance: high,
      buy: buy,
      sell: sell,
      ticker: data
    });
  });
});

router.get('/eu.json', cache('20 seconds'), function (req, res, next) {
  ticker.ethusd(function (results) {
    var data = results.map(item => {
      item.quoine = item.exchange != 'quoine' ? (item.bid - results[0].ask) / results[0].ask : '';
      item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[1].ask) / results[1].ask : '';
      item.poloniex = item.exchange != 'poloniex' ? (item.bid - results[2].ask) / results[2].ask : '';
      item.binance = item.exchange != 'binance' ? (item.bid - results[3].ask) / results[3].ask : '';
      item.hitbtc = item.exchange != 'hitbtc' ? (item.bid - results[4].ask) / results[4].ask : '';
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
      if (item.bitfinex > high) {
        high = item.bitfinex;
        sell = item.exchange;
        buy = 'bitfinex';
      }
      if (item.poloniex > high) {
        high = item.poloniex;
        sell = item.exchange;
        buy = 'poloniex';
      }
      if (item.binance > high) {
        high = item.binance;
        sell = item.exchange;
        buy = 'binance';
      }
      if (item.hitbtc > high) {
        high = item.hitbtc;
        sell = item.exchange;
        buy = 'hitbtc';
      }
    });

    res.json({
      chance: high,
      buy: buy,
      sell: sell,
      ticker: data
    });
  });
});

router.get('/bu.json', cache('20 seconds'), function (req, res, next) {
  ticker.btcusd(function (results) {
    var data = results.map(item => {
      item.quoine = item.exchange != 'quoine' ? (item.bid - results[0].ask) / results[0].ask : '';
      item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[1].ask) / results[1].ask : '';
      item.poloniex = item.exchange != 'poloniex' ? (item.bid - results[2].ask) / results[2].ask : '';
      item.binance = item.exchange != 'binance' ? (item.bid - results[3].ask) / results[3].ask : '';
      item.hitbtc = item.exchange != 'hitbtc' ? (item.bid - results[4].ask) / results[4].ask : '';
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
      if (item.bitfinex > high) {
        high = item.bitfinex;
        sell = item.exchange;
        buy = 'bitfinex';
      }
      if (item.poloniex > high) {
        high = item.poloniex;
        sell = item.exchange;
        buy = 'poloniex';
      }
      if (item.binance > high) {
        high = item.binance;
        sell = item.exchange;
        buy = 'binance';
      }
      if (item.hitbtc > high) {
        high = item.hitbtc;
        sell = item.exchange;
        buy = 'hitbtc';
      }
    });

    res.json({
      chance: high,
      buy: buy,
      sell: sell,
      ticker: data
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

router.get('/quoine', function (req, res, next) {
  res.render('quoine');
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

router.get('/qtq.json', cache('10 seconds'), function (req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var qash_usd = body.find(item => item.currency_pair_code === 'QASHUSD');

      var qash_eth = body.find(item => item.currency_pair_code === 'QASHETH');
      var eth_usd = body.find(item => item.currency_pair_code === 'ETHUSD');

      var qash_btc = body.find(item => item.currency_pair_code === 'QASHBTC');
      var btc_usd = body.find(item => item.currency_pair_code === 'BTCUSD');

      var data = [];

      var qash_eth_usd = qash_eth.market_bid * eth_usd.market_bid;
      var qash_usd_eth = qash_usd.market_bid / eth_usd.market_ask;

      var qash_btc_usd = qash_btc.market_bid * btc_usd.market_bid;
      var qash_usd_btc = qash_usd.market_bid / btc_usd.market_ask;

      data.push({
        currency: "QASH_ETH_USD",
        eth: qash_eth.market_bid,
        btc: "",
        usd: qash_eth_usd,
        qash: qash_eth_usd / qash_usd.market_ask,
        percentage: (qash_eth_usd / qash_usd.market_ask) - 1
      });

      data.push({
        currency: "QASH_USD_ETH",
        eth: qash_usd_eth,
        btc: "",
        usd: qash_usd.market_bid,
        qash: qash_usd_eth / qash_eth.market_ask,
        percentage: (qash_usd_eth / qash_eth.market_ask) - 1
      });

      data.push({
        currency: "QASH_BTC_USD",
        eth: "",
        btc: qash_btc.market_bid,
        usd: qash_btc_usd,
        qash: qash_btc_usd / qash_usd.market_ask,
        percentage: (qash_btc_usd / qash_usd.market_ask) - 1
      });

      data.push({
        currency: "QASH_USD_BTC",
        eth: "",
        btc: qash_usd_btc,
        usd: qash_usd.market_bid,
        qash: qash_usd_btc / qash_btc.market_ask,
        percentage: (qash_usd_btc / qash_btc.market_ask) - 1
      });
      res.json(data);
    }
  });
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

router.get('/stq.json', cache('10 seconds'), function (req, res, next) {
  request.get({
    url: 'https://api.quoine.com/products',
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var eth_sgd = body.find(item => item.currency_pair_code === 'ETHSGD');
      var qash_eth = body.find(item => item.currency_pair_code === 'QASHETH');

      var btc_sgd = body.find(item => item.currency_pair_code === 'BTCSGD');
      var qash_btc = body.find(item => item.currency_pair_code === 'QASHBTC');

      var qash_sgd = body.find(item => item.currency_pair_code === 'QASHSGD');

      var data = [];

      var sgd_qash = 1 / qash_sgd.market_ask;
      var sgd_eth_qash = (1 / eth_sgd.market_ask) / qash_eth.market_bid;
      var sgd_btc_qash = (1 / btc_sgd.market_ask) / qash_btc.market_bid;

      data.push({
        currency: "SGDQASH",
        eth: "",
        btc: "",
        qash: sgd_qash,
        sgd: 1 / sgd_qash,
        percentage: 0
      });
      data.push({
        currency: "SGDETHQASH",
        eth: 1 / eth_sgd.market_ask,
        btc: "",
        qash: sgd_eth_qash,
        sgd: 1 / sgd_eth_qash,
        percentage: (sgd_eth_qash - sgd_qash) / sgd_qash
      });
      data.push({
        currency: "SGDBTCQASH",
        eth: "",
        btc: 1 / btc_sgd.market_ask,
        qash: sgd_btc_qash,
        sgd: 1 / sgd_btc_qash,
        percentage: (sgd_btc_qash - sgd_qash) / sgd_qash
      });
      res.json(data);
    }
  });
});

router.get('/bitfinex', function (req, res, next) {
  res.render('bitfinex');
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

router.get('/btq.json', cache('10 seconds'), function (req, res, next) {
  async.parallel(
    {
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
      btcusd: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/btcusd',
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      },
      qshusd: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/qshusd',
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

      var btc_qash = 1 / result.qshbtc.bid;
      var btc_usd_qash = result.btcusd.bid / result.qshusd.ask;

      data.push({
        currency: "BTC",
        usd: "",
        qash: btc_qash,
        qash_usd: result.btcusd.bid / btc_qash,
        percentage: 0
      });
      data.push({
        currency: "BTC",
        usd: result.btcusd.bid,
        qash: btc_usd_qash,
        qash_usd: result.btcusd.bid / btc_usd_qash,
        percentage: (btc_usd_qash - btc_qash) / btc_qash
      });
      res.json(data);
    }
  );
});

router.get('/etq.json', cache('10 seconds'), function (req, res, next) {
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
      ethusd: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/ethusd',
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            callback(null, body);
          }
        });
      },
      qshusd: function (callback) {
        request.get({
          url: 'https://api.bitfinex.com/v1/pubticker/qshusd',
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

      var eth_qash = 1 / result.qsheth.bid;
      var eth_usd_qash = result.ethusd.bid / result.qshusd.ask;

      data.push({
        currency: "ETH",
        usd: "",
        qash: eth_qash,
        qash_usd: result.ethusd.bid / eth_qash,
        percentage: 0
      });
      data.push({
        currency: "ETH",
        usd: result.ethusd.bid,
        qash: eth_usd_qash,
        qash_usd: result.ethusd.bid / eth_usd_qash,
        percentage: (eth_usd_qash - eth_qash) / eth_qash
      });
      res.json(data);
    }
  );
});

router.get('/cycle', function (req, res, next) {
  res.render("cycle");
});

router.get("/spread", function (req, res, next) {
  request.get({
    url: 'https://api.coinmarketcap.com/v1/ticker',
    json: true
  }, function (error, response, body) {
    var total = body.length;
    var up_1h = body.filter(item => item.percent_change_1h > 0).length / total;
    var up_24h = body.filter(item => item.percent_change_24h > 0).length / total;
    var up_7d = body.filter(item => item.percent_change_7d > 0).length / total;

    res.render("spread", {
      up_1h: (up_1h * 100).toFixed(2) + "%",
      up_24h: (up_24h * 100).toFixed(2) + "%",
      up_7d: (up_7d * 100).toFixed(2) + "%"
    });
  });
});

router.get("/spread.json", function (req, res, next) {
  var exchange = req.query.exchange;
  async.parallel({
    coinmarketcap: function (callback) {
      request.get({
        url: 'https://api.coinmarketcap.com/v1/ticker/?convert=ETH',
        json: true
      }, function (error, response, body) {
        callback(null, body);
      });
    },
    quoine: function (callback) {
      if (exchange == 'quoine' || exchange == 'qryptos') {
        request.get({
          url: 'https://api.' + exchange + '.com/products',
          json: true
        }, function (error, response, body) {
          var data = body
            .filter(item => item.market_ask > 0)
            .filter(item => item.volume_24h > 50);
          callback(null, data);
        });
      } else {
        callback(null, null);
      }
    },
    binance: function (callback) {
      if (exchange == 'binance') {
        request.get({
          url: 'https://api.binance.com/api/v1/ticker/allBookTickers',
          json: true
        }, function (error, response, body) {
          var data = body
            .filter(item => item.symbol.endsWith('ETH'))
            .map(item => {
              item.market_ask = item.askPrice;
              item.market_bid = item.bidPrice;
              item.symbol = item.symbol.replace('ETH', '');
              return item;
            });
          callback(null, data);
        });
      } else {
        callback(null, null);
      }
    }
  }, function (err, results) {
    if (exchange == 'quoine' || exchange == 'qryptos') {
      var data = results.quoine
        .map(item => {
          item.percentage = (item.market_ask - item.market_bid) / item.market_bid;
          item.change_24h = (item.market_bid - item.last_price_24h) / item.last_price_24h;
          var symbol = item.base_currency;
          if (symbol == 'VET') {
            symbol = 'VEN';
          }
          if (results.coinmarketcap != null) {
            item.coinmarketcap = results.coinmarketcap.find(c => c.symbol == symbol);
          }
          return item;
        })
        .filter(item => item.coinmarketcap != null);

      res.json(data);
    } else {
      var data = results.binance
        .map(item => {
          item.percentage = (item.market_ask - item.market_bid) / item.market_bid;
          item.quoted_currency = 'ETH';
          var symbol = item.symbol;
          if (results.coinmarketcap != null) {
            item.coinmarketcap = results.coinmarketcap.find(c => c.symbol == symbol);
          }
          return item;
        })
        .filter(item => item.coinmarketcap != null);
      res.json(data);
    }
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

router.get("/qqbp", function (req, res, next) {
  res.render("qqbp");
});

router.get("/qqbp.json", function (req, res, next) {
  async.parallel({
    quoine: function (callback) {
      request.get({
        url: "https://api.quoine.com/products",
        json: true
      }, function (error, response, body) {
        callback(null, body);
      });
    },
    qryptos: function (callback) {
      request.get({
        url: "https://api.qryptos.com/products",
        json: true
      }, function (error, response, body) {
        callback(null, body);
      });
    },
    bitfinex: function (callback) {
      async.map([
        'btcusd',
        'bchusd',
        'neousd',
        'ethbtc',
        'ethusd',
        'btceur',
        'zecbtc',
        'xmrbtc',
        'ethbtc',
        'etcbtc',
        'xrpbtc',
        'ltcbtc',
        'bchbtc',
        'neobtc',
        'omgbtc',
        'omgeth',
        'neoeth',
        'qtmusd',
        'qtmbtc',
        'qtmeth',
        'qshusd',
        'qshbtc',
        'qsheth'],
        fetch,
        function (err, results) {
          callback(null, results);
        }
      );
    },
    poloniex: function (callback) {
      request.get({
        url: "https://poloniex.com/public?command=returnTicker",
        json: true
      }, function (error, response, body) {
        callback(null, body);
      });
    }
  }, function (err, results) {
    var data =
      results.quoine.concat(results.qryptos)
        .map(item => {
          return {
            pair: item.currency_pair_code,
            quoine: {
              ask: item.market_ask,
              bid: item.market_bid
            },
            bitfinex: getBitfinex(item, results.bitfinex),
            poloniex: getPoloniex(item, results.poloniex)
          };
        });

    res.json(data);
  });
});

var fetch = function (symbol, callback) {
  request.get({
    url: "https://api.bitfinex.com/v1/pubticker/" + symbol,
    json: true
  }, function (error, response, body) {
    body.symbol = symbol;
    callback(null, body);
  });
}

function getBitfinex(q, b) {
  var quoted_currency = q.quoted_currency;
  var base_currency = q.base_currency;

  if (base_currency == 'QASH') {
    base_currency = 'QSH';
  } else if (base_currency == 'QTUM') {
    base_currency = 'QTM';
  }
  var pair = (base_currency + quoted_currency).toLowerCase();

  var ask = '';
  var bid = '';
  var ticker = b.find(item => item.symbol == pair);
  if (ticker) {
    ask = ticker.ask;
    bid = ticker.bid;
  }

  return {
    ask: ask,
    bid: bid
  }
}

function getPoloniex(q, p) {
  var quoted_currency = q.quoted_currency;
  var base_currency = q.base_currency;
  var pair;
  if (quoted_currency == 'USD') {
    pair = 'USDT_' + base_currency;
  } else {
    pair = quoted_currency + '_' + base_currency;
  }

  var ask = '';
  var bid = '';
  if (p[pair]) {
    ask = p[pair].lowestAsk;
    bid = p[pair].highestBid;
  }

  return {
    ask: ask,
    bid: bid
  }
}

router.get("/cmc", function (req, res, next) {
  res.render("cmc");
});

router.get("/cmc.json", function (req, res, next) {
  request.get({
    url: 'https://api.coinmarketcap.com/v1/ticker/?convert=ETH',
    json: true
  }, function (error, response, body) {
    res.json(body);
  });
});

router.get("/price", function (req, res) {
  res.render("price");
});

router.get("/price.json/:currency?", function (req, res, next) {
  var currency = req.query.currency;

  var quoine_id = 51;
  var qryptos_id = 31;
  var bitfinex_id = 'qsheth';

  if (currency == 'QASHBTC') {
    quoine_id = 52;
    qryptos_id = 32;
    bitfinex_id = 'qshbtc';
  } else if (currency == 'QASHUSD') {
    quoine_id = 57;
    qryptos_id = null;
    bitfinex_id = 'qshusd';
  } else if (currency == 'QASHSGD') {
    quoine_id = 59;
    qryptos_id = null;
    bitfinex_id = null;
  } else if (currency == 'QASHAUD') {
    quoine_id = 60;
    qryptos_id = null;
    bitfinex_id = null;
  }
  async.parallel({
    bitfinex: function (callback) {
      if (bitfinex_id) {
        bitfinex.trades(bitfinex_id, function (data) {
          data = data.map(item => {
            item.exchange = "bitfinex";
            item.currency = currency;
            item.type = item.type.toLowerCase();
            if (item.type == "sell") {
              item.amount = item.amount * -1;
            }
            item.value = item.amount * item.price;
            item.timestamp = new Date(parseInt(item.timestamp) * 1000).toLocaleString('en-US', { timeZone: 'Asia/Singapore' });

            return item;
          });
          callback(null, data);
        });
      } else {
        callback(null, []);
      }
    },
    quoine: function (callback) {
      if (quoine_id) {
        var client = new qq(config.quoine);
        client.trades(quoine_id, function (data) {
          var total_pages = data.total_pages;
          console.log("quoine total page: " + total_pages);
          var paging = [];
          for (let index = 2; index <= total_pages; index++) {
            paging.push(index);
          }

          async.concat(paging,
            function (page, cb) {
              client.orders(quoine_id, page, function (data) {
                cb(null, data.models);
              });
            },
            function (err, results) {
              data = data.models
                .concat(results)
                .filter(item => item.filled_quantity > 0)
                .map(item => {
                  item.exchange = "quoine";
                  item.currency = currency;
                  item.type = item.side;
                  item.amount = item.filled_quantity;
                  item.price = item.average_price;
                  if (item.type == "sell") {
                    item.amount = item.amount * -1;
                  }
                  item.value = item.amount * item.price;
                  item.timestamp = new Date(parseInt(item.updated_at) * 1000).toLocaleString('en-US', { timeZone: 'Asia/Singapore' });

                  return item;
                });
              callback(null, data);
            });
        });
      } else {
        callback(null, []);
      }
    },
    qryptos: function (callback) {
      if (qryptos_id) {
        var client = new qq(config.qryptos);
        client.trades(qryptos_id, function (data) {
          var total_pages = data.total_pages;
          total_pages = 10;
          console.log("qryptos total page: " + total_pages);
          var paging = [];
          for (let index = 2; index <= total_pages; index++) {
            paging.push(index);
          }

          async.concat(paging,
            function (page, cb) {
              client.orders(qryptos_id, page, function (data) {
                cb(null, data.models);
              });
            },
            function (err, results) {
              data = data.models
                .concat(results)
                .filter(item => item.filled_quantity > 0)
                .map(item => {
                  item.exchange = "qryptos";
                  item.currency = currency;
                  item.type = item.side;
                  item.amount = item.filled_quantity;
                  item.price = item.average_price;
                  if (item.type == "sell") {
                    item.amount = item.amount * -1;
                  }
                  item.value = item.amount * item.price;
                  item.timestamp = new Date(parseInt(item.updated_at) * 1000).toLocaleString('en-US', { timeZone: 'Asia/Singapore' });

                  return item;
                });
              callback(null, data);
            });
        });
      } else {
        callback(null, []);
      }
    }
  }, function (err, results) {
    res.json(results.bitfinex.concat(results.quoine).concat(results.qryptos));
  });
});

module.exports = router;
