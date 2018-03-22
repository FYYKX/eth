$(function () {
  var table = $("#change").DataTable({
    "ajax": {
      "url": "change.json",
      "dataSrc": ""
    },
    "columns": [
      {
        "data": "up_1h"
      },
      {
        "data": "up_24h"
      },
      {
        "data": "up_7d"
      }
    ],
    "columnDefs": [{
      "targets": "_all",
      "render": function (data, type, row, meta) {
        var value = parseFloat(data.replace(".00%", "")) / 100;
        if (value < 0.3 || value > 0.7) {
          var css = value > 0.7 ? "label-success" : "label-danger";
          return "<h3><span class='label " + css + "'>" + data + "%" + "</span><h3>";
        } else {
          return "<h3>" + data + "</h3>";
        }
      }
    }]
  });

  setInterval(function () {
    table.ajax.reload();
  }, 60 * 1000);
});
