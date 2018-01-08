var request = require('request');
var crypto = require('crypto');
var formurlencoded = require('form-urlencoded');

var config = require('../../config');

var
    api_key = config.poloniex.api_key,
    api_secret = config.poloniex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Key': api_key
        },
        baseUrl: 'https://poloniex.com'
    });

function getOptions(payload) {
    payload = formurlencoded(payload);
    var signature = crypto.createHmac('sha512', api_secret).update(payload).digest('hex');
    return {
        url: '/tradingApi',
        headers: {
            'Sign': signature
        },
        body: payload
    };
}

var returnBalances = function (callback) {
    var payload = {
        'command': 'returnBalances1',
        'nonce': Date.now().toString()
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

module.exports = {
    balances: returnBalances
};