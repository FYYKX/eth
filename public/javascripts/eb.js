$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var last = 0;
  var table = $("#eb").DataTable({
    "ajax": {
      "url": "eb.json",
      "dataSrc": function (json) {
        var chance = json.chance;
        if (chance > 0.01 && chance > last && $("#" + json.sell + "_eth").val() && $("#" + json.buy + "_btc").val()) {
          new Notification("ETHBTC " + (chance * 100).toFixed(2) + "%", {
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
        "data": "qryptos"
      },
      {
        "data": "bitfinex"
      },
      {
        "data": "poloniex"
      },
      {
        "data": "binance"
      },
      {
        "data": "hitbtc"
      }
    ],
    "columnDefs": [
      {
        "targets": 0,
        "render": function (data, type, row, meta) {
          return "<span class='label " + data + "'>" + data + "</span>";
        }
      },
      {
        "targets": [3, 4, 5, 6, 7, 8],
        "render": function (data, type, row, meta) {
          if (data) {
            var css = data > 0.001 ? "label-warning" : "label-danger";
            if (data > 0.001) {
              var buy;
              switch (meta.col) {
                case 3:
                  buy = "quoine";
                  break;
                case 4:
                  buy = "qryptos";
                  break;
                case 5:
                  buy = "bitfinex";
                  break;
                case 6:
                  buy = "poloniex";
                  break;
                case 7:
                  buy = "binance";
                  break;
                default:
                  buy = "hitbtc";
              }

              if ($("#" + row.exchange + "_eth").val() && $("#" + buy + "_btc").val()) {
                css = "label-success";
              }
            }

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
