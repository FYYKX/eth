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

var ethusd = function (callback) {
  async.parallel([
    function (callback) {
      request.get({
        url: "https://api.quoine.com/products/27",
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
        url: "https://api.bitfinex.com/v1/pubticker/ethusd",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, {
            "exchange": "bitfinex",
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
        json: true
      }, function (error, reponse, body) {
        try {
          callback(null, {
            "exchange": "poloniex",
            "bid": parseFloat(body.USDT_ETH.highestBid),
            "ask": parseFloat(body.USDT_ETH.lowestAsk)
          });
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.binance.com/api/v1/ticker/allBookTickers",
        json: true
      }, function (error, response, body) {
        try {
          body = body.find(item => item.symbol == "ETHUSDT");
          callback(null, {
            "exchange": "binance",
            "bid": body.bidPrice,
            "ask": body.askPrice
          });
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.hitbtc.com/api/2/public/ticker/ETHUSD",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, {
            "exchange": "hitbtc",
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
      callback(results);
    }
  );
};

var btcusd = function (callback) {
  async.parallel([
    function (callback) {
      request.get({
        url: "https://api.quoine.com/products/1",
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
        url: "https://api.bitfinex.com/v1/pubticker/btcusd",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, {
            "exchange": "bitfinex",
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
        json: true
      }, function (error, reponse, body) {
        try {
          callback(null, {
            "exchange": "poloniex",
            "bid": parseFloat(body.USDT_BTC.highestBid),
            "ask": parseFloat(body.USDT_BTC.lowestAsk)
          });
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.binance.com/api/v1/ticker/allBookTickers",
        json: true
      }, function (error, response, body) {
        try {
          body = body.find(item => item.symbol == "BTCUSDT");
          callback(null, {
            "exchange": "binance",
            "bid": body.bidPrice,
            "ask": body.askPrice
          });
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.hitbtc.com/api/2/public/ticker/BTCUSD",
        json: true
      }, function (error, response, body) {
        try {
          callback(null, {
            "exchange": "hitbtc",
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
      callback(results);
    }
  );
};

var qash = function (quoine, qryptos, bitfinex, callback) {
  async.parallel([
    function (callback) {
      request.get({
        url: "https://api.quoine.com/products/" + quoine,
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
        url: "https://api.qryptos.com/products/" + qryptos,
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
        url: "https://api.bitfinex.com/v1/pubticker/" + bitfinex,
        json: true
      }, function (error, response, body) {
        try {
          callback(null, {
            "exchange": "bitfinex",
            "bid": parseFloat(body.bid),
            "ask": parseFloat(body.ask)
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

var ethbtc = function (callback) {
  async.parallel([
    function (callback) {
      request.get({
        url: "https://api.quoine.com/products/37",
        json: true
      }, function (error, response, body) {
        try {
          var data = {
            "exchange": "quoine",
            "bid": body.market_bid,
            "ask": body.market_ask
          };
          callback(null, data);
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.qryptos.com/products/4",
        json: true
      }, function (error, response, body) {
        try {
          var data = {
            "exchange": "qryptos",
            "bid": body.market_bid,
            "ask": body.market_ask
          };
          callback(null, data);
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.bitfinex.com/v1/pubticker/ethbtc",
        json: true
      }, function (error, response, body) {
        try {
          var data = {
            "exchange": "bitfinex",
            "bid": parseFloat(body.bid),
            "ask": parseFloat(body.ask)
          };
          callback(null, data);
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
          var data = {
            "exchange": "poloniex",
            "bid": parseFloat(body.BTC_ETH.highestBid),
            "ask": parseFloat(body.BTC_ETH.lowestAsk)
          };
          callback(null, data);
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.binance.com/api/v1/ticker/allBookTickers",
        json: true
      }, function (error, response, body) {
        try {
          body = body.find(item => item.symbol == "ETHBTC");
          var data = {
            "exchange": "binance",
            "bid": body.bidPrice,
            "ask": body.askPrice
          };
          callback(null, data);
        } catch (e) {
          return callback(null, null);
        }
      });
    },
    function (callback) {
      request.get({
        url: "https://api.hitbtc.com/api/2/public/ticker/ETHBTC",
        json: true
      }, function (error, response, body) {
        try {
          var data = {
            "exchange": "hitbtc",
            "bid": body.bid,
            "ask": body.ask
          };
          callback(null, data);
        } catch (e) {
          return callback(null, null);
        }
      });
    }
  ],
    function (err, results) {
      if (err) {
        console.log(err);
      }
      callback(results.filter(item => item != null));
    }
  );
};

module.exports = {
  btc: btc,
  qash: qash,
  ethusd: ethusd,
  btcusd: btcusd,
  ethbtc: ethbtc
};
