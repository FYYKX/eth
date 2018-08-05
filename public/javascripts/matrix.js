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
            "select": {
                "style": "os",
                "items": "cell"
            },
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
                },
                {
                    "data": "bitforex"
                }
            ],
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "exchange",
                    "render": function (data, type, row, meta) {
                        if (data == "notsupport") {
                            $(table.column(meta.row + 1).header()).children().css("opacity", 0)
                        }
                        return "<span class='label " + data + "'>" + data + "</span>";
                    }
                },
                {
                    "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    "render": function (data, type, row, meta) {
                        if (data == null || data == "" || data == -1) {
                            return "";
                        } else if (data <= 0) {
                            return "<span class='" + meta.row + meta.col + "'>" + (data * 100).toFixed(2) + "%</span>";
                        } else {
                            var css = data > 0.05 ? "label-success" : "label-danger";
                            return "<span class='label " + css + " " + meta.row + meta.col + "' style='opacity: " + (data * 75) + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                        }
                    }
                }
            ]
        });

        table.on('select', function (e, dt, type, indexes) {
            var item = (indexes[0].column - 1).toString() + (indexes[0].row + 1).toString();
            $("span." + item).each(function () {
                $(this).parent().addClass("selected");
            });
        });

        setInterval(function () {
            table.ajax.reload();
        }, 60 * 1000);
    });
});
