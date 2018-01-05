var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var
    api_key = config.bitfinex.api_key,
    api_secret = config.bitfinex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'X-BFX-APIKEY': api_key
        },
        baseUrl: 'https://api.bitfinex.com/v1'
    });

function getOptions(url, payload) {
    payload = new Buffer(JSON.stringify(payload)).toString('base64');
    var signature = crypto.createHmac('sha384', api_secret).update(payload).digest('hex');
    return {
        url: url,
        headers: {
            'X-BFX-PAYLOAD': payload,
            'X-BFX-SIGNATURE': signature
        },
        body: payload
    };
}

var balances = function (callback) {
    var url = '/balances';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString()
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

module.exports = {
    balances: balances
};
