var request = require('request');
var async = require('async');

var product = function(quoineID, qryptosID, bitfinexID, callback) {
  async.parallel([
      function(callback) {
        request.get({
          url: "https://api.quoine.com/products/" + quoineID + "/price_levels",
          json: true,
        }, function(error, response, body) {
          try {
            callback(error, {
              "exchange": "<span class='label label-primary'>quoine</span>",
              "bid": parseFloat(body.buy_price_levels[0][0]),
              "bid_amount": parseFloat(body.buy_price_levels[0][1]),
              "ask": parseFloat(body.sell_price_levels[0][0]),
              "ask_amount": parseFloat(body.sell_price_levels[0][1]),
              "amount": Math.min(parseFloat(body.buy_price_levels[0][1]), parseFloat(body.sell_price_levels[0][1]))
            });
          } catch (e) {
            return callback(e);
          }
        });
      },
      function(callback) {
        if (qryptosID != null) {
          request.get({
            url: "https://api.qryptos.com/products/" + qryptosID + "/price_levels",
            json: true
          }, function(error, response, body) {
            try {
              callback(error, {
                "exchange": "<span class='label label-warning'>qryptos</span>",
                "bid": parseFloat(body.buy_price_levels[0][0]),
                "bid_amount": parseFloat(body.buy_price_levels[0][1]),
                "ask": parseFloat(body.sell_price_levels[0][0]),
                "ask_amount": parseFloat(body.sell_price_levels[0][1]),
                "amount": Math.min(parseFloat(body.buy_price_levels[0][1]), parseFloat(body.sell_price_levels[0][1]))
              });
            } catch (e) {
              return callback(e);
            }
          });
        } else {
          return callback(null, null);
        }
      },
      function(callback) {
        if (bitfinexID != null) {
          request.get({
            url: "https://api.bitfinex.com/v1/book/" + bitfinexID,
            json: true
          }, function(error, response, body) {
            try {
              callback(error, {
                "exchange": "<span class='label label-success'>bitfinex</span>",
                "bid": parseFloat(body.bids[0].price),
                "bid_amount": parseFloat(body.bids[0].amount),
                "ask": parseFloat(body.asks[0].price),
                "ask_amount": parseFloat(body.asks[0].amount),
                "amount": Math.min(parseFloat(body.bids[0].amount), parseFloat(body.asks[0].amount))
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
    function(err, results) {
      callback(results);
    }
  );
};

module.exports = {
  product: product
};
