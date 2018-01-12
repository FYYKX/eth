$(function () {
    $("#price_qa").DataTable({
        "ajax": {
            "url": "price.json",
            "data": function (d) {
                d.currency = "QASHAUD";
            },
            "dataSrc": ""
        },
        "columns": [
            {
                "data": "currency"
            },
            {
                "data": "exchange"
            },
            {
                "data": "type"
            },
            {
                "data": "amount"
            },
            {
                "data": "price"
            },
            {
                "data": "value"
            },
            {
                "data": "timestamp"
            }
        ],
        "columnDefs": [
            {
                "targets": [1, 2],
                "render": function (data, type, row, meta) {
                    return "<span class='label " + data + "'>" + data + "</span>";
                }
            }
        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;
            total_amount = api
                .column(3)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);
            $(api.column(3).footer()).html(total_amount);

            total_value = api
                .column(5)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);
            $(api.column(5).footer()).html(total_value);

            $(api.column(4).footer()).html((total_value / total_amount).toFixed(8));
        }
    });
});