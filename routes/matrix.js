var express = require('express');
var apicache = require('apicache');
var async = require('async');
var request = require('request');

var router = express.Router();
var cache = apicache.middleware;

router.get('/', function (req, res) {
    res.render("matrix");
});

router.get('/matrix.json/:pair?', cache('10 seconds'), function (req, res) {
    var pair = req.query.pair;
    async.parallel([
        function (callback) {
            request.get({
                url: "https://api.qryptos.com/products",
                json: true
            }, function (error, response, body) {
                try {
                    var data = body.find(item => item.currency_pair_code == pair);
                    callback(null, {
                        exchange: "qryptos",
                        ask: data.market_ask,
                        bid: data.market_bid
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "qryptos",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            request.get({
                url: "https://api.bitfinex.com/v1/pubticker/" + pair.toLowerCase(),
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "bitfinex",
                        ask: body.ask,
                        bid: body.bid
                    });
                } catch (e) {
                    return callback(e, null);
                }
            });
        },
        function (callback) {
            request.get({
                url: "https://poloniex.com/public?command=returnTicker",
                json: true
            }, function (error, response, body) {
                try {
                    //pair transform
                    var poloniex_pair = "BTC_ETH";
                    callback(null, {
                        exchange: "poloniex",
                        ask: body[poloniex_pair].lowestAsk,
                        bid: body[poloniex_pair].highestBid
                    });
                } catch (e) {
                    return callback(e, null);
                }
            });
        },
        function (callback) {
            request.get({
                url: "https://api.binance.com/api/v3/ticker/bookTicker?symbol=" + pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "binance",
                        ask: body.askPrice,
                        bid: body.bidPrice
                    });
                } catch (e) {
                    return callback(e, null);
                }
            });
        },
    ], function (err, results) {
        if (err) {
            console.log(err);
        }
        var data = results.map(item => {
            item.qryptos = item.exchange != 'qryptos' ? (item.bid - results[0].ask) / results[0].ask : '';
            item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[1].ask) / results[1].ask : '';
            item.poloniex = item.exchange != 'poloniex' ? (item.bid - results[2].ask) / results[2].ask : '';
            item.binance = item.exchange != 'binance' ? (item.bid - results[3].ask) / results[3].ask : '';
            return item;
        });

        res.json(data);
    });
});

module.exports = router;
