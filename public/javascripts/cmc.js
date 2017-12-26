$(function () {
    var table = $("#cmc").DataTable({
        "ajax": {
            "url": "cmc.json",
            "dataSrc": ""
        },
        "order": [
            [5, "desc"]
        ],
        "columns": [
            {
                "data": "symbol"
            },
            {
                "data": "name"
            },
            {
                "data": "price_usd"
            },
            {
                "data": "price_sgd"
            },
            {
                "data": "price_btc"
            },
            {
                "data": "percent_change_1h"
            },
            {
                "data": "percent_change_24h"
            },
            {
                "data": "percent_change_7d"
            },
            {
                "data": "change_1_24"
            }
        ],
        "columnDefs": [{
            "targets": [5, 6, 7, 8],
            "render": function (data, type, row, meta) {
                var css = data > 0 ? "label-success" : "label-danger";
                return "<span class='label " + css + "'>" + data + "%" + "</span>";
            }
        }]
    });

    $('input[type=search]').on('keyup', function () {
        console.log('cmc');
        table.search(this.value).draw();
    });

    setInterval(function () {
        table.ajax.reload();
    }, 60 * 1000);
});
