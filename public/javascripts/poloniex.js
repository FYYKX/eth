$(function () {
    var table = $("#poloniex").DataTable({
        "ajax": {
            "url": "poloniex.json",
            "dataSrc": ""
        },
        "columns": [
            {
                "data": "currency"
            },
            {
                "data": "price"
            }
        ]
    });

    setInterval(function () {
        table.ajax.reload();
    }, 15 * 1000);
});
