$(function () {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  var table = $("table").DataTable({
    "ajax": {
      "url": "qes.json",
      "dataSrc": function (json) {
        if (json[0].percentage > 0.05) {
          new Notification(json[0].action, {
            body: json[0].percentage,
            icon: "/images/qryptos.png"
          });
        }
        return json;
      }
    },
    "order": [
      [3, "desc"]
    ],
    "columns": [{
      "data": "action"
    },
      {
        "data": "sell"
      },
      {
        "data": "buy"
      },
      {
        "data": "percentage"
      }
    ],
    "columnDefs": [{
      "targets": 3,
      "data": "percentage",
      "render": function (data, type, row, meta) {
        var css = data > 0 ? "label-success" : "label-danger";
        return "<span class='label " + css + "'>" + (data * 100).toFixed(2) + "%" + "</span>";
      }
    }]
  });

  setInterval(function () {
    table.ajax.reload();
  }, 5 * 1000);
});
