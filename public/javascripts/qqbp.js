$(function () {
    var table = $("#qqbp").DataTable({
        "ajax": {
            "url": "qqbp.json",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.length; i < ien; i++) {
                    if (json[i].bitfinex.bid > json[i].quoine.ask) {
                        json[i].bitfinex.bid = "<span class='label label-success'>" + json[i].bitfinex.bid + "</span>";
                    }

                    if (json[i].poloniex.bid > json[i].quoine.ask) {
                        json[i].poloniex.bid = "<span class='label label-success'>" + json[i].poloniex.bid + "</span>";
                    }
                }

                return json;
            }
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
