$(function() {
  var table = $("table").DataTable({
    "paging": false,
    "ajax": {
      "url": "btc.json",
      "dataSrc": function(json) {
        var ask = json.ask;
        var ticker = json.ticker;
        for (var i = 0, ien = ticker.length; i < ien; i++) {
          var percentage = (ticker[i].bid - ask) / ask;
          ticker[i].percentage = percentage;
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
      }
    ],
    "columnDefs": [{
      "targets": 4,
      "data": "percentage",
      "render": function(data, type, row, meta) {
        var css = data > 0 ? "label-success" : "label-danger";
        return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
      }
    }]
  });

  setInterval(function() {
    table.ajax.reload();
  }, 10 * 1000);
});
