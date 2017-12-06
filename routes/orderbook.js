var request = require('request');
var async = require('async');

var qash = function (callback) {
  async.parallel([
      function (callback) {
        request.get({
          url: "https://api.quoine.com/products/51/price_levels",
          json: true
        }, function (error, response, body) {
          try {
            callback(error, {
              "exchange": "<span class='label label-primary'>quoine</span>",
              "country": "",
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
      function (callback) {
        request.get({
          url: "https://api.qryptos.com/products/31/price_levels",
          json: true
        }, function (error, response, body) {
          try {
            callback(error, {
              "exchange": "<span class='label label-warning'>qryptos</span>",
              "country": "",
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
      function (callback) {
        request.get({
          url: "https://api.bitfinex.com/v1/book/QSHETH",
          json: true
        }, function (error, response, body) {
          try {
            callback(error, {
              "exchange": "<span class='label label-success'>bitfinex</span>",
              "country": "",
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
      }
    ],
    function (err, results) {
      callback(results);
    }
  );
};

module.exports = {
  qash: qash
};
