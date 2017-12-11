$(function () {
    var table = $("#spread").DataTable({
        "ajax": {
            "url": "spread.json",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.length; i < ien; i++) {
                    json[i].spread = json[i].market_ask - json[i].market_bid;
                    json[i].sp = json[i].spread / json[i].market_bid;
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
                "data": "sp"
            },
            {
                "data": "volume_24h"
            }
        ],
        "columnDefs": [{
            "targets": 4,
            "data": "sp",
            "render": function (data, type, row, meta) {
                var css = data > 0 ? "label-success" : "label-danger";
                return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
            }
        }]
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 15 * 1000);
});
