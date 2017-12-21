$(function () {
    var table = $("#qqbp").DataTable({
        "ajax": {
            "url": "qqbp.json",
            "dataSrc": ""
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [
            {
                "data": "pair"
            },
            {
                "data": "quoine.ask"
            },
            {
                "data": "quoine.bid"
            },
            {
                "data": "bitfinex.ask"
            },
            {
                "data": "bitfinex.bid"
            },
            {
                "data": "poloniex.ask"
            },
            {
                "data": "poloniex.bid"
            }
        ]
    });
});
