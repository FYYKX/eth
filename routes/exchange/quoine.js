var request = require('request');
var jwt = require('jsonwebtoken');

var self;

var quoine = function (config) {
	self = this;

	this.token_id = config.token_id;
	this.user_secret = config.user_secret;
	this.baseRequest = request.defaults({
		headers: {
			'Content-Type': 'application/json',
			'X-Quoine-API-Version': '2'
		},
		baseUrl: config.base_url
	});
}

function getOptions(verb, url, payload) {
	var signature = jwt.sign(payload, self.user_secret);
	var body = '';

	if (verb == 'PUT' || verb == 'POST') {
		body = JSON.stringify(payload);
	}

	return {
		url: url,
		headers: {
			'X-Quoine-Auth': signature
		},
		body: body
	};
}

quoine.prototype.balances = function (callback) {
	var verb = 'GET';
	var url = '/accounts/balance';
	var payload = {
		'path': url,
		'nonce': Date.now(),
		'token_id': this.token_id
	};

	var options = getOptions(verb, url, payload);

	this.baseRequest.get(options, function (error, response, body) {
		try {
			callback(JSON.parse(body));
		} catch (e) {
			callback(null);
		}
	});
};

module.exports = quoine;