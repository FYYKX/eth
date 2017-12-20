$(function () {
    var table = $("#qryptos").DataTable({
        "ajax": {
            "url": "spread.json?exchange=qryptos",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.length; i < ien; i++) {
                    json[i].percentage = (json[i].market_ask - json[i].market_bid) / json[i].market_bid;
                    if (json[i].coinmarketcap) {
                        json[i].price = json[i].coinmarketcap["price_" + json[i].quoted_currency.toLowerCase()];
                        if (json[i].market_bid < json[i].price) {
                            json[i].market_bid = "<span class='label label-info'>" + json[i].market_bid + "</span>";
                        }
                    } else {
                        json[i].price = "";
                    }
                    json[i].change_24h = (json[i].market_bid - json[i].last_price_24h) / json[i].last_price_24h
                }

                return json;
            }
        },
        "order": [
            [3, "desc"]
        ],
        "columns": [
            {
                "data": "currency_pair_code"
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
                "data": "volume_24h"
            },
            {
                "data": "price"
            },
            {
                "data": "coinmarketcap.percent_change_24h"
            },
            {
                "data": "disabled"
            }
        ],
        "columnDefs": [
            {
                "targets": 3,
                "data": "percentage",
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            },
            {
                "targets": 6,
                "data": "coinmarketcap.percent_change_24h",
                "render": function (data, type, row, meta) {
                    if (data) {
                        var css = data > 0 ? "label-success" : "label-danger";
                        return "<span class='label " + css + "'>" + data + "%" + "</span>";
                    } else {
                        return "";
                    }
                }
            },
            {
                "targets": 7,
                "data": "disabled",
                "render": function (data, type, row, meta) {
                    var css = data ? "label-danger" : "label-success";
                    return "<span class='label " + css + "'>" + data + "</span>"
                }
            }
        ]
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 30 * 1000);
});
