var request = require('request');
var jwt = require('jsonwebtoken');

var config = require('../../config');

var
	token_id = config.liquid.token_id,
	user_secret = config.liquid.user_secret,
	baseRequest = request.defaults({
		headers: {
			'Content-Type': 'application/json',
			'X-Quoine-API-Version': '2'
		},
		baseUrl: 'https://api.liquid.com/',
		json: true
	});

function getOptions(verb, url, payload) {
	var signature = jwt.sign(payload, user_secret);
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

var balances = function (callback) {
	var verb = 'GET';
	var url = '/accounts/balance';
	var payload = {
		'path': url,
		'nonce': Date.now(),
		'token_id': token_id
	};

	var options = getOptions(verb, url, payload);

	baseRequest.get(options, function (error, response, body) {
		callback(body);
	});
};

var trades = function (product_id, callback) {
	var verb = 'GET';
	var url = '/orders?product_id=' + product_id + '&limit=100';

	var payload = {
		'path': url,
		'nonce': Date.now(),
		'token_id': token_id
	};

	var options = getOptions(verb, url, payload);

	baseRequest.get(options, function (error, response, body) {
		callback(body);
	});
};

var orders = function (product_id, page, callback) {
	var verb = 'GET';
	var url = '/orders?product_id=' + product_id + '&limit=100&page=' + page;

	var payload = {
		'path': url,
		'nonce': Date.now(),
		'token_id': token_id
	};

	var options = getOptions(verb, url, payload);

	baseRequest.get(options, function (error, response, body) {
		callback(body);
	});
};

module.exports = {
	balances,
	trades,
	orders
};