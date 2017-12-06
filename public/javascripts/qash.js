$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var last = 0;

  var table = $("table").DataTable({
    "ajax": {
      "url": "qash/orderbook.json",
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
        }

        if (chance > 0.05 && chance > last) {
          new Notification("QASHETH", {
            body: "Sell QASH at " + exchange + " " + chance,
            icon: "/images/qash.png"
          });
          last = chance;
        }
        return ticker;
      }
    },
    "order": [
      [4, "desc"]
    ],
    "columns": [{
      "data": "exchange"
    },
      {
        "data": "country"
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
        "data": "amount"
      }
    ],
    "columnDefs": [{
      "targets": 4,
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
  }, 5 * 1000);
});
