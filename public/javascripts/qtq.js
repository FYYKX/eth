$(function () {
  var table = $("#qtq").DataTable({
    "ajax": {
      "url": "qtq.json",
      "dataSrc": ""
    },
    "order": [
      [5, "desc"]
    ],
    "columns": [
      {
        "data": "currency"
      },
      {
        "data": "eth"
      },
      {
        "data": "btc"
      },
      {
        "data": "usd"
      },
      {
        "data": "qash"
      },
      {
        "data": "percentage"
      }
    ],
    "columnDefs": [{
      "targets": 5,
      "render": function (data, type, row, meta) {
        if (data != 0) {
          var css = data > 0 ? "label-success" : "label-danger";
          return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
        } else {
          return data;
        }
      }
    }]
  });

  setInterval(function () {
    table.ajax.reload();
  }, 10 * 1000);
});
