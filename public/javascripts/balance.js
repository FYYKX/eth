$(function () {
    var table = $("#balance").DataTable({
        "ajax": {
            "url": "balances",
            "dataSrc": ""
        },
        "ordering": false,
        "columns": [
            {
                "data": "exchange"
            },
            {
                "data": "btc"
            },
            {
                "data": "eth"
            },
            {
                "data": "qash"
            },
            {
                "data": "usd"
            }
        ],
        "columnDefs": [
            {
                "targets": 0,
                "render": function (data, type, row, meta) {
                    return "<span class='label " + data + "'>" + data + "</span>";
                }
            },
            {
                "targets": 1,
                "render": function (data, type, row, meta) {
                    var id = row.exchange + "_btc";
                    if (data < 0.01) {
                        return "<span class='label label-danger'>" + data + "</span>";
                    } else {
                        return data + "<input id='" + id + "' type='hidden' value='true'>";
                    }
                }
            },
            {
                "targets": 2,
                "render": function (data, type, row, meta) {
                    var id = row.exchange + "_eth";
                    if (data < 0.1) {
                        return "<span class='label label-danger'>" + data + "</span>";
                    } else {
                        return data + "<input id='" + id + "' type='hidden' value='true'>";
                    }
                }
            },
            {
                "targets": 3,
                "render": function (data, type, row, meta) {
                    var id = row.exchange + "_qash";
                    if (data < 100) {
                        return "<span class='label label-danger'>" + data + "</span>";
                    } else {
                        return data + "<input id='" + id + "' type='hidden' value='true'>";
                    }
                }
            },
            {
                "targets": 4,
                "render": function (data, type, row, meta) {
                    var id = row.exchange + "_usd";
                    if (data < 100) {
                        return "<span class='label label-danger'>" + data + "</span>";
                    } else {
                        return data + "<input id='" + id + "' type='hidden' value='true'>";
                    }
                }
            }
        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;

            btc_total = api
                .column(1)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            eth_total = api
                .column(2)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            qash_total = api
                .column(3)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            usd_total = api
                .column(4)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            $(api.column(1).footer()).html(
                btc_total
            );
            $(api.column(2).footer()).html(
                eth_total
            );
            $(api.column(3).footer()).html(
                qash_total
            );
            $(api.column(4).footer()).html(
                usd_total
            );
        }
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 10 * 1000);
});
