var express = require('express');

var config = require('../config');
var router = express.Router();

router.get('/:exchange', function (req, res) {
  var exchange = require('./exchange/' + req.params.exchange);
  exchange.trades(function (body) {
    res.json(body);
  });
});

router.get('/:exchange/:product_id', function (req, res) {
  var exchange = req.params.exchange;
  var product_id = req.params.product_id;
  var qq = 'quoine';
  if (exchange == 'qryptos') {
    exchange = 'quoine';
    qq = 'qryptos';
  }

  var client = require('./exchange/' + exchange);
  if (exchange == 'quoine') {
    client = new client(config[qq]);
  }
  client.trades(product_id, function (body) {
    res.json(body);
  });
});

module.exports = router;
