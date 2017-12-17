$(function () {
    var table = $("#poloniex").DataTable({
        "ajax": {
            "url": "poloniex.json",
            "dataSrc": ""
        },
        "order": [
            [2, "desc"]
        ],
        "columns": [
            {
                "data": "currency"
            },
            {
                "data": "price"
            },
            {
                "data": "change"
            }
        ],
        "columnDefs": [{
            "targets": 2,
            "data": "change",
            "render": function (data, type, row, meta) {
                var css = data > 0 ? "label-success" : "label-danger";
                return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
            }
        }]
    });

    setInterval(function () {
        table.ajax.reload();
    }, 30 * 1000);
});
