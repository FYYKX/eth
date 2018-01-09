var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var
    api_key = config.binance.api_key,
    api_secret = config.binance.api_secret,
    baseRequest = request.defaults({
        headers: {
            'X-MBX-APIKEY': api_key
        },
        baseUrl: 'https://api.binance.com',
        json: true
    });

function getOptions(url, payload) {
    payload.timestamp = new Date().getTime();
    var query = Object.keys(payload)
        .reduce(function (a, k) {
            a.push(k + '=' + encodeURIComponent(payload[k]));
            return a
        }, [])
        .join('&');
    var signature = crypto.createHmac('sha256', api_secret).update(query).digest('hex');
    return {
        url: url + '?' + query + '&signature=' + signature
    };
}

var balances = function (callback) {
    var url = '/api/v3/account';
    var options = getOptions(url, {});

    baseRequest.get(options, function (error, response, body) {
        callback(body);
    });
};

module.exports = {
    balances: balances
};
