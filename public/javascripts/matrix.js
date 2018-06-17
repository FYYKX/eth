$(function () {
    var table = $("#matrix").DataTable({
        "ajax": {
            "url": "matrix/matrix.json",
            "data": function (d) {
                d.pair = "ETHBTC";
            },
            "dataSrc": ""
        },
        "ordering": false,
        "columns": [
            {
                "data": "exchange"
            },
            {
                "data": "qryptos"
            },
            {
                "data": "bitfinex"
            },
            {
                "data": "poloniex"
            },
            {
                "data": "binance"
            }
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "exchange",
                "render": function (data, type, row, meta) {
                    return "<span class='label " + data + "'>" + data + "</span>";
                }
            },
            {
                "targets": [1, 2, 3, 4],
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label label-success" : "";
                    return "<span class='" + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            }
        ]
    });

    setInterval(function () {
        table.ajax.reload();
    }, 60 * 1000);
});
