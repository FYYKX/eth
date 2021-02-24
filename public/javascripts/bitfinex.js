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
        ],
        "columnDefs": [{
            "targets": [1, 2],
            "data": "percentage",
            "render": function (data, type, row, meta) {
                var css = data > 0 ? "label-success" : "label-danger";
                return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
            }
        }]
    });
});
