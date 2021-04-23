$(function () {
    var table = $("#ledger").DataTable({
        "ajax": {
            "url": "trades/bitfinex",
            "dataSrc": ""
        },
        "order": [
            [3, "desc"]
        ],
        "lengthMenu": [[25, -1], [25, "All"]],
        "columnDefs": [
            {
                "targets": [0, 2, 4, 7],
                "visible": false
            },
            {
                "targets": 3,
                "type": "date",
                "render": function (data, type, row, meta) {
                    var date = new Date(data);
                    return date.toLocaleString();
                }
            },
            {
                "targets": 5,
                "render": function (data, type, row, meta) {
                    var amount = data.toFixed(2)
                    var css = "label-warning";
                    if (amount > 1) {
                        css = "label-success";
                    } else if (amount < -1) {
                        css = "label-danger"
                    }
                    return "<span class='label " + css + "'>" + amount + "</span>";
                }
            },
        ],
        "headerCallback": function (row, data, start, end, display) {
            var api = this.api();

            // Total over all pages
            total = api
                .column(5)
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            // Total over this page
            pageTotal = api
                .column(5, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            // Update header
            $(api.column(5).header()).html(
                '$' + pageTotal.toFixed(2) + ' ( $' + total.toFixed(2) + ' total)'
            );
        }
    });

    setInterval(function () {
        table.ajax.reload();
    }, 10 * 1000);
});
