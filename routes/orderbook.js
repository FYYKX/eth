var request = require('request');
var async = require('async');

var product = function (quoineID, qryptosID, bitfinexID, callback) {
  async.parallel(
    [
      function (callback) {
        request.get({
          url: "https://api.quoine.com/products/" + quoineID + "/price_levels",
          json: true,
        }, function (error, response, body) {
          try {
            callback(null, {
              "exchange": "quoine",
              "bid": parseFloat(body.buy_price_levels[0][0]),
              "bid_amount": parseFloat(body.buy_price_levels[0][1]),
              "ask": parseFloat(body.sell_price_levels[0][0]),
              "ask_amount": parseFloat(body.sell_price_levels[0][1]),
            });
          } catch (e) {
            return callback(e);
          }
        });
      },
      function (callback) {
        if (qryptosID != null) {
          request.get({
            url: "https://api.qryptos.com/products/" + qryptosID + "/price_levels",
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "qryptos",
                "bid": parseFloat(body.buy_price_levels[0][0]),
                "bid_amount": parseFloat(body.buy_price_levels[0][1]),
                "ask": parseFloat(body.sell_price_levels[0][0]),
                "ask_amount": parseFloat(body.sell_price_levels[0][1]),
              });
            } catch (e) {
              return callback(e);
            }
          });
        } else {
          return callback(null, null);
        }
      },
      function (callback) {
        if (bitfinexID != null) {
          request.get({
            url: "https://api.bitfinex.com/v1/book/" + bitfinexID,
            json: true
          }, function (error, response, body) {
            try {
              callback(null, {
                "exchange": "bitfinex",
                "bid": parseFloat(body.bids[0].price),
                "bid_amount": parseFloat(body.bids[0].amount),
                "ask": parseFloat(body.asks[0].price),
                "ask_amount": parseFloat(body.asks[0].amount),
              });
            } catch (e) {
              return callback(e);
            }
          });
        } else {
          return callback(null, null);
        }
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
  product: product
};
