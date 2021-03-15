var request = require('request');
var crypto = require('crypto');
var config = require('../../config');

var
    apiKey = config.bitfinex.api_key,
    apiSecret = config.bitfinex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'bfx-apikey': apiKey,
        },
        baseUrl: 'https://api.bitfinex.com',
        json: true
    });

function getOptions(apiPath, body) {
    const nonce = (Date.now() * 1000).toString()
    let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`
    var sig = crypto.createHmac('sha384', apiSecret).update(signature).digest('hex');
    return {
        url: apiPath,
        headers: {
            'bfx-nonce': nonce,
            'bfx-signature': sig
        },
        body: body
    };
}

var wallets = function (callback) {
    var apiPath = 'v2/auth/r/wallets';
    var payload = {};

    var options = getOptions(apiPath, payload);
    baseRequest.post(options, function (error, response, body) {
        callback(body);
    });
};

var ledgers = function (callback) {
    var apiPath = 'v2/auth/r/ledgers/hist';
    var payload = {
        start: Date.now() - (7 * 24 * 3600 * 1000),
        limit: 2500
    };

    var options = getOptions(apiPath, payload);
    baseRequest.post(options, function (error, response, body) {
        callback(body);
    });
};

module.exports = {
    balances: wallets,
    trades: ledgers
};
