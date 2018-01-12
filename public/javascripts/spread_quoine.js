$(function () {
    var table = $("#quoine").DataTable({
        "ajax": {
            "url": "spread.json?exchange=quoine",
            "dataSrc": ""
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
                "data": "change_24h"
            },
            {
                "data": "disabled"
            }
        ],
        "columnDefs": [
            {
                "targets": 3,
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            },
            {
                "targets": 5,
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            },
            {
                "targets": 6,
                "render": function (data, type, row, meta) {
                    var css = data ? "label-danger" : "label-success";
                    return "<span class='label " + css + "'>" + data + "</span>"
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
    }, 30 * 1000);
});
