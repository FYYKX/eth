$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var last = 0;
  var table = $("#eu").DataTable({
    "ajax": {
      "url": "eu.json",
      "dataSrc": function (json) {
        var chance = json.chance;
        if (chance > 0.01 && chance > last && $("#" + json.sell + "_eth").val() && $("#" + json.buy + "_usd").val()) {
          new Notification("ETHUSD " + (chance * 100).toFixed(2) + "%", {
            body: "Sell at " + json.sell + " Buy at " + json.buy,
            icon: "/images/" + json.sell + ".png"
          });
          last = chance;
        }
        return json.ticker;
      }
    },
    "ordering": false,
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
        "data": "quoine"
      },
      {
        "data": "bitfinex"
      },
      {
        "data": "poloniex"
      },
      {
        "data": "bittrex"
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
        "targets": [3, 4, 5, 6],
        "render": function (data, type, row, meta) {
          if (data) {
            var css = data > 0.01 ? "label-info" : data > 0 ? "label-warning" : "label-danger";
            return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
          } else {
            return "";
          }
        }
      }]
  });

  //API users should not make more than 300 requests per 5 minute
  setInterval(function () {
    table.ajax.reload();
  }, 20 * 1000);
});
