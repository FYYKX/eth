$(function () {
    $(".matrix").each(function () {
        var pair = $(this).attr('id');

        var table = $(this).DataTable({
            "ajax": {
                "url": "/matrix/matrix.json",
                "data": function (d) {
                    d.pair = pair;
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
                },
                {
                    "data": "hitbtc"
                },
                {
                    "data": "allcoin"
                },
                {
                    "data": "bittrex"
                },
                {
                    "data": "yobit"
                },
                {
                    "data": "exmo"
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
                    "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    "render": function (data, type, row, meta) {
                        if (data == null || data == "" || data == -1) {
                            return "";
                        } else if (data <= 0) {
                            return (data * 100).toFixed(2) + "%";
                        } else {
                            var css = data > 0.05 ? "label-success" : "label-danger";
                            return "<span class='label " + css + "' style='opacity: " + (data * 75) + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                        }
                    }
                }
            ]
        });

        setInterval(function () {
            table.ajax.reload();
        }, 60 * 1000);
    });
});
