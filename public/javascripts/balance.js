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
        ]
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 10 * 1000);
});
