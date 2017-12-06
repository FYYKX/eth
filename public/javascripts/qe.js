$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var table = $('table').DataTable({
    "ajax": {
      "url": "qe.json",
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

        if (chance > 0.05) {
          new Notification('QASHETH', {
            body: 'Sell QASH at ' + exchange + ' ' + chance,
            icon: '/images/qash.png'
          });
        }
        return ticker;
      }
    },
    "order": [
      [3, "desc"]
    ],
    "columns": [{
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
      }
    ],
    "columnDefs": [{
      "targets": 3,
      "data": "percentage",
      "render": function (data, type, row, meta) {
        var css = data > 0 ? 'label-success' : 'label-danger';
        return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
      }
    }]
  });

  setInterval(function () {
    table.ajax.reload();
  }, 5 * 1000);
});
