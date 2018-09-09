var request = require('request');
var async = require('async');

var product = function (liquidID, bitfinexID, callback) {
  async.parallel(
    [
      function (callback) {
        request.get({
          url: "https://api.liquid.com/products/" + liquidID + "/price_levels",
          json: true,
        }, function (error, response, body) {
          callback(null, {
            "exchange": "liquid",
            "bid": parseFloat(body.buy_price_levels[0][0]),
            "bid_amount": parseFloat(body.buy_price_levels[0][1]),
            "ask": parseFloat(body.sell_price_levels[0][0]),
            "ask_amount": parseFloat(body.sell_price_levels[0][1]),
          });
        });
      },
      function (callback) {
        if (bitfinexID != null) {
          request.get({
            url: "https://api.bitfinex.com/v1/book/" + bitfinexID,
            json: true
          }, function (error, response, body) {
            callback(null, {
              "exchange": "bitfinex",
              "bid": parseFloat(body.bids[0].price),
              "bid_amount": parseFloat(body.bids[0].amount),
              "ask": parseFloat(body.asks[0].price),
              "ask_amount": parseFloat(body.asks[0].amount),
            });
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
