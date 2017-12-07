$(function() {
  var table = $("#bte").DataTable({
    "ajax": {
      "url": "bte.json",
      "dataSrc": function(json) {
        console.log(json);
        return json;
      }
    },
    "order": [
      [3, "desc"]
    ],
    "columns": [{
        "data": "currency"
      },
      {
        "data": "usd"
      },
      {
        "data": "sgd"
      },
      {
        "data": "eth"
      },
      {
        "data": "percentage"
      }
    ],
    "columnDefs": [{
      "targets": 4,
      "data": "percentage",
      "render": function(data, type, row, meta) {
        if (data != 0) {
          var css = data > 0 ? "label-success" : "label-danger";
          return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
        } else {
          return data;
        }
      }
    }]
  });

  setInterval(function() {
    table.ajax.reload();
  }, 15 * 1000);
});
