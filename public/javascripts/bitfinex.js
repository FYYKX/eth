$(function () {
    var table = $("#bitfinex").DataTable({
        "paging": false,
        "ajax": {
            "url": "bitfinex.json",
            "dataSrc": function (json) {
                return json;
            }
        },
        "columns": [
            {
                "data": "symbol"
            },
            {
                "data": "c1"
            },
            {
                "data": "c2"
            },
            {
                "data": "c3"
            },
            {
                "data": "c4"
            },
        ],
        "columnDefs": [{
            "targets": [1, 2, 3, 4],
            "data": "percentage",
            "render": function (data, type, row, meta) {
                var price = (data * 100).toFixed(2)
                var css = "label-danger";
                if (price > 2) {
                    css = "label-success"
                } else if (price > 0) {
                    css = "label-warning"
                } else if (price == 0) {
                    css = "label-default"
                }
                return "<span class='label " + css + "'>" + price + "%" + "</span>";
            }
        }]
    });

    setInterval(function () {
        table.ajax.reload();
    }, 5 * 60 * 1000);
});
