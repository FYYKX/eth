$(function () {
    var table = $("#quoine").DataTable({
        "ajax": {
            "url": "spread.json?exchange=quoine",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.length; i < ien; i++) {
                    json[i].spread = json[i].market_ask - json[i].market_bid;
                    json[i].percentage = json[i].spread / json[i].market_bid;
                    json[i].change_24h = (json[i].market_bid - json[i].last_price_24h) / json[i].last_price_24h
                }

                return json;
            }
        },
        "order": [
            [4, "desc"]
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
                "data": "spread"
            },
            {
                "data": "percentage"
            },
            {
                "data": "volume_24h"
            },
            {
                "data": "change_24h"
            },
            {
                "data": "last_traded_price"
            },
            {
                "data": "last_traded_quantity"
            }
        ],
        "columnDefs": [
            {
                "targets": 4,
                "data": "percentage",
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            },
            {
                "targets": 6,
                "data": "change_24h",
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            }
        ]
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 15 * 1000);
});
