$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var last = 0;
  var table = $("#qe").DataTable({
    "ajax": {
      "url": "qqb.json",
      "data": function (d) {
        d.currency = "ETH";
      },
      "dataSrc": function (json) {
        var chance = json.chance;
        if (chance > 0.01 && chance > last && $("#" + json.sell + "_qash").val() && $("#" + json.buy + "_eth").val()) {
          new Notification("QASHETH " + (chance * 100).toFixed(2) + "%", {
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
        "data": "liquid"
      },
      {
        "data": "bitfinex"
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
        "targets": [3, 4],
        "render": function (data, type, row, meta) {
          if (data) {
            var css = data > 0.001 ? "label-warning" : "label-danger";
            if (data > 0.001) {
              var buy;
              switch (meta.col) {
                case 3:
                  buy = "liquid";
                  break;
                default:
                  buy = "bitfinex";
              }

              if ($("#" + row.exchange + "_qash").val() && $("#" + buy + "_eth").val()) {
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
