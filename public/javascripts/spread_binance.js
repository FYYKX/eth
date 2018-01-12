$(function () {
    var table = $("#binance").DataTable({
        "ajax": {
            "url": "spread.json?exchange=binance",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.length; i < ien; i++) {
                    if (json[i].coinmarketcap) {
                        if (json[i].coinmarketcap["price_" + json[i].quoted_currency.toLowerCase()]) {
                            json[i].price = json[i].coinmarketcap["price_" + json[i].quoted_currency.toLowerCase()];
                            json[i].coin_ask = (json[i].market_ask - json[i].price) / json[i].price;
                            json[i].coin_bid = (json[i].market_bid - json[i].price) / json[i].price;

                            if (json[i].market_ask <= json[i].price) {
                                json[i].market_ask = "<span class='label label-danger'>" + json[i].market_ask + "</span>";
                            }

                            if (json[i].market_bid >= json[i].price) {
                                json[i].market_bid = "<span class='label label-warning'>" + json[i].market_bid + "</span>";
                            }
                        } else {
                            json[i].price = "";
                            json[i].coin_ask = "";
                            json[i].coin_bid = "";
                        }
                    } else {
                        json[i].price = "";
                    }
                }

                return json;
            }
        },
        "order": [
            [3, "desc"]
        ],
        "columns": [
            {
                "data": "symbol"
            },
            {
                "data": "market_ask"
            },
            {
                "data": "market_bid"
            },
            {
                "data": "percentage"
            },
            {
                "data": "price"
            },
            {
                "data": "coin_ask"
            },
            {
                "data": "coin_bid"
            },
            {
                "data": "coinmarketcap.percent_change_24h"
            },
            {
                "data": "coinmarketcap.price_usd"
            }
        ],
        "columnDefs": [
            {
                "targets": [3, 5, 6],
                "render": function (data, type, row, meta) {
                    if (data) {
                        var css = data > 0 ? "label-success" : "label-danger";
                        return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                    } else {
                        return "";
                    }
                }
            },
            {
                "targets": 7,
                "render": function (data, type, row, meta) {
                    if (data) {
                        var css = data > 0 ? "label-success" : "label-danger";
                        return "<span class='label " + css + "'>" + data + "%" + "</span>";
                    } else {
                        return "";
                    }
                }
            }
        ]
    });

    $('input[type=search]').on('keyup', function () {
        table.search(this.value).draw();
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 60 * 1000);
});
