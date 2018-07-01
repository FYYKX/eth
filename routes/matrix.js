var express = require('express');
var apicache = require('apicache');
var async = require('async');
var request = require('request');

var router = express.Router();
var cache = apicache.middleware;

var products = {
    default: {
        qryptos: "",
        bitfinex: "",
        poloniex: "",
        binance: "",
        hitbtc: "",
        allcoin: "",
        bittrex: "",
        yobit: "",
        exmo: ""
    },
    BTCUSD: {
        qryptos: "",
        bitfinex: "btcusd",
        poloniex: "USDT_BTC",
        binance: "BTCUSDT",
        hitbtc: "BTCUSD",
        allcoin: "",
        bittrex: "USD-BTC",
        yobit: "btc_usd",
        exmo: "BTC_USD"
    },
    ETHUSD: {
        qryptos: "",
        bitfinex: "ethusd",
        poloniex: "USDT_ETH",
        binance: "ETHUSDT",
        hitbtc: "ETHUSD",
        allcoin: "",
        bittrex: "USD-ETH",
        yobit: "eth_usd",
        exmo: "ETH_USD"
    },
    EOSUSD: {
        qryptos: "",
        bitfinex: "eosusd",
        poloniex: "",
        binance: "EOSUSDT",
        hitbtc: "EOSUSD",
        allcoin: "",
        bittrex: "",
        yobit: "eos_usd",
        exmo: "EOS_USD"
    },
    XRPUSD: {
        qryptos: "",
        bitfinex: "xrpusd",
        poloniex: "USDT_XRP",
        binance: "XRPUSDT",
        hitbtc: "XRPUSDT",
        allcoin: "",
        bittrex: "USDT-XRP",
        yobit: "",
        exmo: "XRP_USD"
    },
    TRXUSD: {
        qryptos: "",
        bitfinex: "trxusd",
        poloniex: "",
        binance: "TRXUSDT",
        hitbtc: "TRXUSD",
        allcoin: "",
        bittrex: "USDT-TRX",
        yobit: "trx_usd",
        exmo: "TRX_USD"
    },
    XLMUSD: {
        qryptos: "",
        bitfinex: "xlmusd",
        poloniex: "USDT-STR",
        binance: "XLMUSDT",
        hitbtc: "XLMUSD",
        allcoin: "",
        bittrex: "",
        yobit: "",
        exmo: ""
    },
    BCHUSD: {
        qryptos: "",
        bitfinex: "bchusd",
        poloniex: "USDT-BCH",
        binance: "BCCUSDT",
        hitbtc: "BCHUSD",
        allcoin: "",
        bittrex: "USDT-BCH",
        yobit: "bcc_usd",
        exmo: "BCH_USD"
    },
    LTCUSD: {
        qryptos: "",
        bitfinex: "ltcusd",
        poloniex: "USDT-LTC",
        binance: "LTCUSDT",
        hitbtc: "LTCUSD",
        allcoin: "",
        bittrex: "USDT-LTC",
        yobit: "ltc_usd",
        exmo: "LTC_USD"
    },
    NEOUSD: {
        qryptos: "",
        bitfinex: "neousd",
        poloniex: "",
        binance: "NEOUSDT",
        hitbtc: "NEOUSD",
        allcoin: "",
        bittrex: "USDT-NEO",
        yobit: "",
        exmo: ""
    },
    VENUSD: {
        qryptos: "",
        bitfinex: "venusd",
        poloniex: "",
        binance: "VENUSDT",
        hitbtc: "VENUSD",
        allcoin: "",
        bittrex: "",
        yobit: "ven_usd",
        exmo: ""
    },
    MIOTAUSD: {
        qryptos: "",
        bitfinex: "iotusd",
        poloniex: "",
        binance: "IOTAUSDT",
        hitbtc: "IOTAUSD",
        allcoin: "",
        bittrex: "",
        yobit: "",
        exmo: ""
    },
    XMRUSD: {
        qryptos: "",
        bitfinex: "xmrusd",
        poloniex: "USDT_XMR",
        binance: "",
        hitbtc: "XMRUSD",
        allcoin: "",
        bittrex: "USDT-XMR",
        yobit: "",
        exmo: "XMR_USD"
    },
    QTUMUSD: {
        qryptos: "",
        bitfinex: "qtmusd",
        poloniex: "",
        binance: "QTUMUSDT",
        hitbtc: "QTUMUSD",
        allcoin: "",
        bittrex: "",
        yobit: "",
        exmo: ""
    },
    ETCUSD: {
        qryptos: "",
        bitfinex: "etcusd",
        poloniex: "USDT-ETC",
        binance: "ETCUSDT",
        hitbtc: "ETCUSD",
        allcoin: "",
        bittrex: "USDT-ETC",
        yobit: "etc_usd",
        exmo: "ETC_USD"
    },
    ZECUSD: {
        qryptos: "",
        bitfinex: "zecusd",
        poloniex: "USDT_ZEC",
        binance: "",
        hitbtc: "ZECUSD",
        allcoin: "",
        bittrex: "USDT-ZEC",
        yobit: "zec_usd",
        exmo: "ZEC_USD"
    },
    ZRXUSD: {
        qryptos: "",
        bitfinex: "zrxusd",
        poloniex: "",
        binance: "",
        hitbtc: "ZRXUSD",
        allcoin: "",
        bittrex: "",
        yobit: "zrx_usd",
        exmo: ""
    },
    REPUSD: {
        qryptos: "",
        bitfinex: "repusd",
        poloniex: "USDT_REP",
        binance: "",
        hitbtc: "REPUSDT",
        allcoin: "",
        bittrex: "",
        yobit: "",
        exmo: ""
    },
    ETHBTC: {
        qryptos: "ETHBTC",
        bitfinex: "ethbtc",
        poloniex: "BTC_ETH",
        binance: "ETHBTC",
        hitbtc: "ETHBTC",
        allcoin: "eth2btc",
        bittrex: "BTC-ETH",
        yobit: "eth_btc",
        exmo: "ETH_BTC"
    },
    EOSBTC: {
        qryptos: "",
        bitfinex: "eosbtc",
        poloniex: "",
        binance: "EOSBTC",
        hitbtc: "EOSBTC",
        allcoin: "",
        bittrex: "",
        yobit: "eos_btc",
        exmo: "EOS_BTC"
    },
};

router.get('/usd', function (req, res) {
    res.render("matrix", {
        pairs: [
            "BCHUSD",
            "BTCUSD",
            "EOSUSD",
            "ETCUSD",
            "ETHUSD",
            "LTCUSD",
            "MIOTAUSD",
            "NEOUSD",
            "QTUMUSD",
            "REPUSD",
            "TRXUSD",
            "VENUSD",
            "XLMUSD",
            "XMRUSD",
            "XRPUSD",
            "ZECUSD",
            "ZRXUSD"
        ]
    });
});

router.get('/btc', function (req, res) {
    res.render("matrix", {
        pairs: [
            "BCHBTC",
            "DASHBTC",
            "EOSBTC",
            "ETCBTC",
            "ETHBTC",
            "LTCBTC",
            "MIOTABTC",
            "NEOBTC",
            "QTUMBTC",
            "REPBTC",
            "TRXBTC",
            "VENBTC",
            "XLMBTC",
            "XRPBTC",
            "XMRBTC",
            "ZECBTC",
            "ZRXBTC"
        ]
    });
});

router.get('/eth', function (req, res) {
    res.render("matrix", {
        pairs: [
            "BCHETH",
            "BTCETH",
            "DASHETH",
            "EOSETH",
            "ETCETH",
            "LTCETH",
            "MIOTAETH",
            "NEOETH",
            "QTUMETH",
            "REPETH",
            "TRXETH",
            "VENETH",
            "XLMETH",
            "XRPETH",
            "XMRETH",
            "ZECETH",
            "ZRXETH"
        ]
    });
});

router.get('/paris', function (req, res) {
    request.get({
        url: "https://api.exmo.com/v1/ticker/",
        json: true
    }, function (error, response, body) {
        res.json(Object.keys(body));
    });
});

router.get('/matrix.json/:pair?', cache('30 seconds'), function (req, res) {
    var pair = products[req.query.pair];
    async.parallel([
        function (callback) {
            var qryptos_pair = pair.qryptos;
            request.get({
                url: "https://api.qryptos.com/products",
                json: true
            }, function (error, response, body) {
                try {
                    var data = body.find(item => item.currency_pair_code == qryptos_pair);
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
            var bitfinex_pair = pair.bitfinex;
            request.get({
                url: "https://api.bitfinex.com/v1/pubticker/" + bitfinex_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "bitfinex",
                        ask: body.ask,
                        bid: body.bid
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "bitfinex",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var poloniex_pair = pair.poloniex;
            request.get({
                url: "https://poloniex.com/public?command=returnTicker",
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "poloniex",
                        ask: body[poloniex_pair].lowestAsk,
                        bid: body[poloniex_pair].highestBid
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "poloniex",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var binance_pair = pair.binance;
            request.get({
                url: "https://api.binance.com/api/v3/ticker/bookTicker?symbol=" + binance_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "binance",
                        ask: body.askPrice,
                        bid: body.bidPrice
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "binance",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var hitbtc_pair = pair.hitbtc;
            request.get({
                url: "https://api.hitbtc.com/api/2/public/ticker/" + hitbtc_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "hitbtc",
                        ask: body.ask,
                        bid: body.bid
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "hitbtc",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var allcoin_pair = pair.allcoin;
            request.post({
                url: "https://www.allcoin.ca/Api_Order/ticker?symbol=" + allcoin_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "allcoin",
                        ask: body.data.sell,
                        bid: body.data.buy
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "allcoin",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var bittrex_pair = pair.bittrex;
            request.post({
                url: "https://bittrex.com/api/v1.1/public/getticker?market=" + bittrex_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "bittrex",
                        ask: body.result.Ask,
                        bid: body.result.Bid
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "bittrex",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var yobit_pair = pair.yobit;
            request.post({
                url: "https://yobit.net/api/3/ticker/" + yobit_pair,
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "yobit",
                        ask: body[yobit_pair].sell,
                        bid: body[yobit_pair].buy
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "yobit",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        },
        function (callback) {
            var exmo_pair = pair.exmo;
            request.post({
                url: "https://api.exmo.com/v1/ticker/",
                json: true
            }, function (error, response, body) {
                try {
                    callback(null, {
                        exchange: "exmo",
                        ask: body[exmo_pair].sell_price,
                        bid: body[exmo_pair].buy_price
                    });
                } catch (e) {
                    return callback(null, {
                        exchange: "exmo",
                        ask: 0,
                        bid: 0
                    });
                }
            });
        }
    ], function (err, results) {
        if (err) {
            console.log(err);
        }
        var data = results
            .filter(item => item != null)
            .map(item => {
                item.qryptos = item.exchange != 'qryptos' ? (item.bid - results[0].ask) / results[0].ask : '';
                item.bitfinex = item.exchange != 'bitfinex' ? (item.bid - results[1].ask) / results[1].ask : '';
                item.poloniex = item.exchange != 'poloniex' ? (item.bid - results[2].ask) / results[2].ask : '';
                item.binance = item.exchange != 'binance' ? (item.bid - results[3].ask) / results[3].ask : '';
                item.hitbtc = item.exchange != 'hitbtc' ? (item.bid - results[4].ask) / results[4].ask : '';
                item.allcoin = item.exchange != 'allcoin' ? (item.bid - results[5].ask) / results[5].ask : '';
                item.bittrex = item.exchange != 'bittrex' ? (item.bid - results[6].ask) / results[6].ask : '';
                item.yobit = item.exchange != 'yobit' ? (item.bid - results[7].ask) / results[7].ask : '';
                item.exmo = item.exchange != 'exmo' ? (item.bid - results[8].ask) / results[8].ask : '';
                return item;
            });

        res.json(data);
    });
});

module.exports = router;
