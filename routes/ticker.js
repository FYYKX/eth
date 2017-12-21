var request = require('request');
var async = require('async');

var btc = function (callback) {
  request.get({
    url: "http://api.fixer.io/latest?base=USD&symbols=KRW,IDR",
    json: true
  }, function (error, response, body) {
    var krw = body.rates.KRW;
    var idr = body.rates.IDR;
    async.parallel(
      [
        function (callback) {
          request.get({
            url: "https://api.bithumb.com/public/ticker/BTC",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "bithumb",
                "country": "Korea",
                "bid": parseFloat(body.data.buy_price) / krw,
                "ask": parseFloat(body.data.sell_price) / krw
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.korbit.co.kr/v1/ticker/detailed",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "korbit",
                "country": "Korea",
                "bid": parseFloat(body.bid) / krw,
                "ask": parseFloat(body.ask) / krw
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.coinone.co.kr/orderbook/",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "coinone",
                "country": "Korea",
                "bid": parseFloat(body.bid[0].price) / krw,
                "ask": parseFloat(body.ask[0].price) / krw
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://getbtc.org/api/stats",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "getbtc",
                "country": "",
                "bid": parseFloat(body.stats.bid),
                "ask": parseFloat(body.stats.ask)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.quoine.com/products/1",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "quoine",
                "country": "",
                "bid": body.market_bid,
                "ask": body.market_ask
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.itbit.com/v1/markets/XBTUSD/ticker",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "itbit",
                "country": "",
                "bid": parseFloat(body.bid),
                "ask": parseFloat(body.ask)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://vip.bitcoin.co.id/api/btc_idr/ticker",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "bitcoin",
                "country": "Indonesian",
                "bid": parseFloat(body.ticker.buy) / idr,
                "ask": parseFloat(body.ticker.sell) / idr
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.gatecoin.com/Public/LiveTickers",
            json: true
          }, function (error, response, body) {
            try {
              var btcusd = body.tickers.find(item => item.currencyPair === 'BTCUSD');
              callback(null, {
                "exchange": "gatecoin",
                "country": "HongKong",
                "bid": parseFloat(btcusd.bid),
                "ask": parseFloat(btcusd.ask)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.bitfinex.com/v1/pubticker/btcusd",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "bitfinex",
                "country": "",
                "bid": parseFloat(body.bid),
                "ask": parseFloat(body.ask)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://api.gdax.com/products/BTC-USD/ticker",
            json: true,
            headers: {
              'User-Agent': 'request'
            }
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "gdax",
                "country": "",
                "bid": parseFloat(body.bid),
                "ask": parseFloat(body.ask)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        },
        function (callback) {
          request.get({
            url: "https://poloniex.com/public?command=returnTicker",
            json: true,
            headers: {
              'User-Agent': 'request'
            }
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "poloniex",
                "country": "",
                "bid": parseFloat(body.USDT_BTC.highestBid),
                "ask": parseFloat(body.USDT_BTC.lowestAsk)
              });
            } catch (e) {
              return callback(null, null);
            }
          });
        }
      ],
      function (err, results) {
        callback(results.filter(item => item != null));
      }
    );
  });
};

var eth = function (callback) {
  async.parallel(
    [
      function (callback) {
        request.get({
          url: "https://api.quoine.com/products/27",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "quoine",
              "country": "",
              "bid": body.market_bid,
              "ask": body.market_ask
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://api.bitfinex.com/v1/pubticker/ethusd",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "bitfinex",
              "country": "",
              "bid": parseFloat(body.bid),
              "ask": parseFloat(body.ask)
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://api.gdax.com/products/ETH-USD/ticker",
          json: true,
          headers: {
            'User-Agent': 'request'
          }
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "gdax",
              "country": "",
              "bid": parseFloat(body.bid),
              "ask": parseFloat(body.ask)
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://bittrex.com/api/v1.1/public/getticker?market=USDT-ETH",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "bittrex",
              "country": "",
              "bid": parseFloat(body.result.Bid),
              "ask": parseFloat(body.result.Ask)
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://poloniex.com/public?command=returnTicker",
          json: true
        }, function (error, reponse, body) {
          try {
            callback(null, {
              "exchange": "poloniex",
              "country": "",
              "bid": parseFloat(body.USDT_ETH.highestBid),
              "ask": parseFloat(body.USDT_ETH.lowestAsk)
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      }
    ],
    function (err, results) {
      callback(results);
    }
  );
};

var qash = function (callback) {
  async.parallel(
    [
      function (callback) {
        request.get({
          url: "https://api.quoine.com/products/51",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "quoine",
              "bid": body.market_bid,
              "ask": body.market_ask
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://api.qryptos.com/products/31",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "qryptos",
              "bid": body.market_bid,
              "ask": body.market_ask
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      },
      function (callback) {
        request.get({
          url: "https://api.bitfinex.com/v1/pubticker/QSHETH",
          json: true
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "bitfinex",
              "bid": body.bid,
              "ask": body.ask
            });
          } catch (e) {
            return callback(null, null);
          }
        });
      }
    ],
    function (err, results) {
      callback(results.filter(item => item != null));
    }
  );
};

module.exports = {
  btc: btc,
  eth: eth,
  qash: qash
};
