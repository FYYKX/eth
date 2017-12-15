$(function () {
    var table = $("#order").DataTable({
        "paging": false,
        "ajax": {
            "url": "order.json",
            "data": function (d) {
                d.id = $("#id").val();
            },
            "dataSrc": ""
        },
        "order": [
            [1, "desc"]
        ],
        "columns": [
            {
                "data": "side"
            },
            {
                "data": "price"
            },
            {
                "data": "amount"
            },
            {
                "data": "percentage"
            }
        ]
    });

    $("#id").change(function () {
        table.ajax.reload();
    });
});
