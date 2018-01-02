$(function () {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (result) {
            console.log(result);
        });
    }

    var last = 0;

    var table = $("#qus").DataTable({
        "ajax": {
            "url": "qus.json",
            "dataSrc": function (json) {
                var ask = json.ask;
                var ticker = json.ticker;
                var chance = 0;
                var exchange = '';
                for (var i = 0, ien = ticker.length; i < ien; i++) {
                    var percentage = (ticker[i].bid - ask) / ask;
                    if (percentage > chance) {
                        chance = percentage;
                        exchange = ticker[i].exchange;
                    }
                    ticker[i].percentage = percentage;
                    ticker[i].spread = ticker[i].ask - ticker[i].bid;
                    ticker[i].sp = ((ticker[i].spread / ticker[i].bid) * 100).toFixed(2) + "%";

                    if (!ticker[i].sgd_usd) {
                        ticker[i].sgd_usd = "";
                    }

                    if (ticker[i].ask == ask) {
                        ticker[i].ask = "<span class='label label-danger'>" + ticker[i].ask + "</span>";
                    }
                }

                // if (chance > 0.05 && chance > last) {
                //     new Notification("QASHUSD " + (chance * 100).toFixed(2) + "%", {
                //         body: "Sell QASH at " + exchange,
                //         icon: "/images/qash.png"
                //     });
                //     last = chance;
                // }
                return ticker;
            }
        },
        "order": [
            [1, "desc"]
        ],
        "columns": [
            {
                "data": "exchange"
            },
            {
                "data": "ask"
            },
            {
                "data": "bid"
            },
            {
                "data": "percentage"
            },
            {
                "data": "sgd_usd"
            },
            {
                "data": "sp"
            }
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "exchange",
                "render": function (data, type, row, meta) {
                    return "<span class='label " + data + "'>" + data + "</span>";
                }
            },
            {
                "targets": 3,
                "data": "percentage",
                "render": function (data, type, row, meta) {
                    var css = data > 0 ? "label-success" : "label-danger";
                    return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
                }
            }]
    });

    //API users should not make more than 300 requests per 5 minute
    setInterval(function () {
        table.ajax.reload();
    }, 20 * 1000);
});
